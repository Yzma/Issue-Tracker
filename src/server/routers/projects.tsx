
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"
import { NamespaceSchema, ProjectCreationSchema, ProjectNamespaceSchema, LabelCreationSchema } from "@/lib/zod-schemas"
import { MemberAffiliation } from "@/lib/zod-types"

const LabelModifySchema = LabelCreationSchema.and(z.object({
  labelId: z.string()
}))

export const getViewableProject = publicProcedure.input(ProjectNamespaceSchema).use(async ({ ctx, input, next }) => {

  const foundProject = await ctx.prisma.project.findFirst({
    where: {
      name: input.name,
      AND: [{
        namespace: {
          name: input.owner
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

  // Conditions:
  // 1. The user is a part of the same organization that owns the project
  // 2. The user is a part of the project (manually invited)
  const searchCondition = foundProject.namespace.organizationId ?
    // Condition 1 - The user is a part of the same organization that owns the project
    {
      userId_organizationId: {
        userId: ctx.session?.user.id,
        organizationId: foundProject.namespace.organizationId
      }
    }
    :
    // Condition 2 - A part of the Project by invite
    {
      userId_projectId: {
        userId: ctx.session?.user.id,
        projectId: foundProject.id
      }
    }

  const foundMember = await ctx.prisma.member.findUnique({
    where: {
      ...searchCondition,
      AND: [
        {
          NOT: {
            acceptedAt: null
          }
        }
      ]
    }
  })

  if (foundProject.private) {

    // If the user isn't logged in or isn't a part of the project, deny them
    if (ctx.session === null || !foundMember) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `The provided Project was not found.`,
      })
    }
  }

  return next({
    ctx: {
      project: foundProject,
      member: foundMember
    }
  })
})

export const ensureUserIsMember = getViewableProject.use(async ({ ctx, input, next }) => {
  if (!ctx.member || ctx.member.role !== OrganizationRole.Owner) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `The provided Project was not found.`,
    })
  }
  return next({
    ctx: {
      ...ctx
    }
  })
})

export const projectsRouter = createTRPCRouter({

  create: privateProcedure
    .input(ProjectCreationSchema).mutation(async ({ ctx, input }) => {

      const foundNamespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.owner
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
            private: input.visibility === "private" ? true : false,
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

  updateProject: ensureUserIsMember.input(ProjectCreationSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project
      .update({
        where: {
          id: ctx.project.id
        },
        data: {
          name: input.name,
          description: input.description,
          private: input.visibility === "private" ? true : false,
        }
      })
  }),

  getProject: getViewableProject.query(async ({ ctx }) => ctx.project),

  /*
    Members
  */

  getMembers: getViewableProject.input(z.object({
    limit: z.number().int().max(25).default(15),
    affiliation: MemberAffiliation
  })).query(async ({ ctx, input }) => {
    
    const affiliation = input.affiliation === "direct" ? 
    {
      NOT: {
        acceptedAt: null
      }
    }
    : input.affiliation === "outside" ?
    {
      acceptedAt: null
    }
    : 
    {} // Empty - fetch all

    return await ctx.prisma.member.findMany({
      where: {
        projectId: ctx.project.id,
        ...affiliation
      },
      take: input.limit
    })
  }),

  inviteMember: ensureUserIsMember.input(NamespaceSchema).mutation(async ({ ctx, input }) => {
    await ctx.prisma.member
      .create({
        data: {
          role: OrganizationRole.User,
          user: {
            connect: {
              username: input.name
            }
          },
          inviteeUser: {
            connect: {
              id: ctx.member?.id
            }
          },
          projectId: ctx.project.id 
        }
      })
  }),

  removeMember: ensureUserIsMember.input(z.object({
    inviteId: z.string() // TODO: Check invite ID
  })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.member
      .delete({
        where: {
          id: input.inviteId
        }
      })
  }),

  /*
    Labels
  */

  getLabels: getViewableProject.input(z.object({
    limit: z.number().int().max(25).default(15)
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.label.findMany({
      where: {
        projectId: ctx.project.id
      },
      take: input.limit
    })
  }),

  createLabel: ensureUserIsMember.input(LabelCreationSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.label.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        projectId: ctx.project.id
      }
    })
  }),

  updateLabel: ensureUserIsMember.input(LabelModifySchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.label.update({
      where: {
        id: ctx.project.id
      },
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
      }
    })
  }),

  removeLabel: ensureUserIsMember.input(LabelModifySchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.label.delete({
      where: {
        id: ctx.project.id
      }
    })
  })
})
