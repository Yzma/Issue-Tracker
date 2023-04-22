
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, optionalAuthedProcedure, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const commonProjectSchema = z.object({
  owner: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX)
});

const getViewableProject = publicProcedure.input(commonProjectSchema).use(async ({ ctx, input, next }) => {

  const foundProject = await ctx.prisma.project.findFirst({
    where: {
      name: input.name,
      AND: [{
        namespace: {
          name: input.name
        }
      }]
    },
    include: {
      namespace: true
    }
  })

  if (!foundProject) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `The provided Project was not found.`,
    })
  }

  if (foundProject.private) {
    // If the user isn't logged in, there is no way to check if they have permission
    if (ctx.session === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `The provided Project was not found.`,
      })
    }

    // Check if the owner user of the project is viewing the project
    if (ctx.session.user?.namespace.id === foundProject.namespaceId) {
      return next({
        ctx: {
          project: foundProject
        }
      });
    }

    // Conditions:
    // 1. The user is a part of the same organization that owns the project
    // 2. The user is a part of the project (manually invited)
    const searchCondition = foundProject.namespace.organizationId ?
      // Condition 1 - The user is a part of the same organization that owns the project
      {
        organizationId: foundProject.namespace.organizationId
      }
      :
      // Condition 2 - A part of the Project by invite
      {
        projectId: foundProject.id
      }

    const foundMember = await ctx.prisma.member.findFirst({
      where: {
        userId: ctx.session.user.id,
        ...searchCondition
      }
    })

    if (!foundMember) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `The provided Project was not found.`,
      })
    }
  }

  return next({
    ctx: {
      project: foundProject
    }
  });
});

export const projectsRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({
      name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
      description: z.string().max(75).optional(),
      private: z.boolean().optional().default(false),
      namespaceName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX) // TODO: Move this into separate schema
    })).mutation(async ({ctx, input }) => {

      const foundNamespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.namespaceName
        }
      })

      if (!foundNamespace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `The provided Namespace was not found.`,
        })
      }

      if (foundNamespace.userId) {

        if (foundNamespace.userId != ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You do not have permission to perform this action.`,
          })
        }

      } else if (foundNamespace.organizationId) {

        const foundMember = await ctx.prisma.member.findFirst({
          where: {
            userId: ctx.session.user.id,
            organizationId: foundNamespace.organizationId
          }
        })

        if (!foundMember || foundMember.role != OrganizationRole.Owner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You do not have permission to perform this action.`,
          })
        }
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `A Project was attempted to be created on a Namespace without a userId or organizationId.`,
        })
      }

      return await ctx.prisma.project
        .create({
          data: {
            name: input.name,
            description: input.description,
            private: input.private,
            namespaceId: foundNamespace.id,
            members: {
              create: {
                userId: ctx.session.user.id,
                role: OrganizationRole.Owner
              }
            },
            labels: {
              create: [
                { name: "Bug", description: "Bug description", color: "392029" },
                {
                  name: "Documentation",
                  description: "Documentation description",
                  color: "122b40"
                },
                {
                  name: "Duplicate",
                  description: "Duplicate description",
                  color: "373c43"
                }
              ]
            }
          }
        })
    }),

  sendInvitation: privateProcedure.input(z.object({
    projectName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
    namespaceName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX), // TODO: Move this into separate schema
    username: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX)
  })).mutation(async ({ ctx, input }) => {
    
  }),

  // TODO: Split logic into separate functions
  getProject: optionalAuthedProcedure
    .input(z.object({
      name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
      namespaceName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX) // TODO: Move this into separate schema
    }))
    .query(async ({ ctx, input }) => {

      const foundProject = await ctx.prisma.project.findFirst({
        where: {
          name: input.name,
          AND: [{
            namespace: {
              name: input.namespaceName
            }
          }]
        },
        include: {
          namespace: true
        }
      })

      if (!foundProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `The provided Project was not found.`,
        })
      }

      if (foundProject.private) {
        // If the user isn't logged in, there is no way to check if they have permission
        if (ctx.session === undefined) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `The provided Project was not found.`,
          })
        }

        // Check if the owner user of the project is viewing the project
        if (ctx.session.user?.namespace.id === foundProject.namespaceId) {
          return foundProject
        }

        // Conditions:
        // 1. The user is a part of the same organization that owns the project
        // 2. The user is a part of the project (manually invited)

        const searchCondition = foundProject.namespace.organizationId ? 
        // Condition 1 - The user is a part of the same organization that owns the project
        {
          organizationId: foundProject.namespace.organizationId
        } 
        :
        // Condition 2 - A part of the Project by invite
        {
          projectId: foundProject.id
        }

        const foundMember = await ctx.prisma.member.findFirst({
          where: {
            // @ts-ignore - Were checking if user is null already (TODO)
            userId: ctx.session.user.id,
            ...searchCondition
          }
        })

        if(!foundMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `The provided Project was not found.`,
          })
        }
      }

      // The project is public or user has permission
      return foundProject
    })
})
