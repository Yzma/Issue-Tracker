
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const commonProjectSchema = z.object({
  owner: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
  project: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX)
})

const projectSettingsSchema = z.object({
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX), // TODO: Could we use the 'name' value from commonProjectSchema?
  description: z.string().max(75),
  private: z.boolean()
})

const getViewableProject = publicProcedure.input(commonProjectSchema).use(async ({ ctx, input, next }) => {

  const foundProject = await ctx.prisma.project.findFirst({
    where: {
      name: input.project,
      AND: [{
        namespace: {
          name: input.project
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

    // @@unique(name: "userId_organizationId", [userId, organizationId])
    // @@unique(name: "userId_projectId", [userId, projectId])

    // export type MemberUserId_organizationIdCompoundUniqueInput = {
    //   userId: string
    //   organizationId: string
    // }
  
    // export type MemberUserId_projectIdCompoundUniqueInput = {
    //   userId: string
    //   projectId: string
    // }
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

const ensureUserIsMember = getViewableProject.use(async ({ ctx, input, next }) => {
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
    .input(z.object({
      name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
      description: z.string().max(75).optional(),
      private: z.boolean().optional().default(false),
      namespaceName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX) // TODO: Move this into separate schema
    })).mutation(async ({ ctx, input }) => {

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

  // TODO: getViewableProject is using publicProcedure so anyone who "has" permission to view the project can also update it
  updateProject: ensureUserIsMember.input(commonProjectSchema.and(projectSettingsSchema.optional())).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project
      .update({
        where: {
          id: ctx.project.id
        },
        data: {
          name: input.name,
          description: input.description,
          private: input.private,
        }
      })
  }),

  // TODO: Move invitations to own router
  // sendInvitation: privateProcedure.input(commonProjectSchema.extend({
  //   username: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX)
  // })).mutation(async ({ ctx, input }) => {

  // }),

  // getViewableProject returns the project if the user has permission to view it
  getProject: getViewableProject.query(async ({ ctx }) => ctx.project),

  /*
    Issues
  */

  getAllIssues: getViewableProject.input(z.object({
    limit: z.number().int().max(25).default(15)
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.issue
      .findMany({
        where: {
          projectId: ctx.project.id,
        },
        take: input.limit
      })
  }),

  createIssue: ensureUserIsMember.input(z.object({
    title: z.string().min(1).max(150),
    description: z.string().min(1).max(2048)
    // TODO: Labels
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.issue
      .create({
        //@ts-ignore - We know user won't be null
        data: {
          name: input.title,
          description: input.description,
          userId: ctx.session?.user.id,
          projectId: ctx.project.id,
          // TODO: Add labels when creating issue
          // labels: {
          //   connect: mapped
          // }
        }
      })
  }),

  // TODO: Check author
  updateIssue: getViewableProject.input(z.object({
    issueId: z.string().max(50), // TODO: Lower this
    title: z.string().min(1).max(150),
    description: z.string().min(1).max(2048)
    // TODO: Labels
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.issue.update({
      where: {
        id: input.issueId
      },
      data: {
        name: input.title,
        description: input.description,
        // TODO: Add labels when creating issue
        // labels: {
        //   connect: mapped
        // }
      }
    })
  }),

  /*
    Members
  */

  getMembers: getViewableProject.input(z.object({
    limit: z.number().int().max(25).default(15),
    affiliation: z.union([
      z.literal('outside'),
      z.literal('direct'),
      z.literal('all')
    ])
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.member.findMany({
      where: {
        projectId: ctx.project.id
      },
      take: input.limit
    })
  }),

  // TODO: The members implementation side will be finished when the changes to the prisma schema are made

  // inviteMember: getViewableProject.input(z.object({
  //   username: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX)
  // })).mutation(async ({ ctx, input }) => {
  //   await ctx.prisma.memberInvitation
  //     .create({
  //       data: {
  //         role: OrganizationRole.Admin,
  //         invitedUser: {
  //           connect: {
  //             username: input.username
  //           }
  //         },
  //         inviteeUser: {
  //           connect: {
  //             id: ctx.session?.user.id
  //           }
  //         },
  //         project: {
  //           connect: {
  //             id: ctx.project.id
  //           }
  //         }
  //       }
  //     })
  // }),

  // removeMember: getViewableProject.query(async ({ ctx }) => ctx.project),

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

  createLabel: ensureUserIsMember.input(z.object({
    name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
    description: z.string().max(75),
    color: z.string().length(6)
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.label.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        projectId: ctx.project.id
      }
    })
  }),

  updateLabel: ensureUserIsMember.input(z.object({
    labelId: z.string(), // TODO: Verify ID
    name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
    description: z.string().max(75),
    color: z.string().length(6)
  })).query(async ({ ctx, input }) => {
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

  removeLabel: ensureUserIsMember.input(z.object({
    labelId: z.string(), // TODO: Verify ID
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.label.delete({
      where: {
        id: ctx.project.id
      }
    })
  })
})
