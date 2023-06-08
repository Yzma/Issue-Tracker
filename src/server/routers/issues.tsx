import { TRPCError } from "@trpc/server"
import { ensureUserIsMember, getViewableProject } from "./projects"
import { createTRPCRouter } from "../trpc"
import { z } from "zod"
import { CreateIssueSchema, ProjectNamespaceSchema } from "@/lib/zod-schemas"

const GetIssueSchema = ProjectNamespaceSchema.and(z.object({
  issueId: z.string()
}))

const ModifyIssueSchema = GetIssueSchema.and(CreateIssueSchema)


// const commentCreationSchema = issueCreationSchema.pick({
//   description: true,
// }).and(z.object({
//   commentId: z.string().uuid(),
// }))

const getIssue = getViewableProject.input(GetIssueSchema).use(async ({ ctx, input, next }) => {
  const issue = await ctx.prisma.issue.findUnique({
    where: {
      id: input.issueId
    }
  })

  if (!issue) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Issue not found"
    })
  }

  return next({
    ctx: {
      issue,
      ...ctx
    }
  })
})

const ensureUserIsAuthorizedForIssue = getIssue.input(GetIssueSchema).use(async ({ ctx, input, next }) => {

  if (ctx.issue.userId !== ctx.session?.user.id || ctx.member?.role !== "Owner") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authorized to perform this action"
    })
  }

  return next({
    ctx: {
      ...ctx
    }
  })
})

const ensureUserIsAuthorizedForComment = getIssue.input(GetIssueSchema).use(async ({ ctx, input, next }) => {

  if (ctx.issue.userId !== ctx.session?.user.id || ctx.member?.role !== "Owner") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authorized to perform this action"
    })
  }

  return next({
    ctx: {
      ...ctx
    }
  })
})

export const issuesRouter = createTRPCRouter({

  // TODO: Move this into projects router?
  getIssue: getViewableProject.input(GetIssueSchema).mutation(async ({ ctx, input }) => {
    return await prisma.issue.findUnique({
      where: {
        id: input.issueId
      }
    })
  }),


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

  createIssue: ensureUserIsMember.input(CreateIssueSchema).mutation(async ({ ctx, input }) => {
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

  // createIssue: getViewableProject.input(ProjectNamespaceSchema.and(CreateIssueSchema)).mutation(async ({ ctx, input }) => {
  //   const mapped = input.labels?.map((label) => {
  //     return {
  //       name: label,
  //     }
  //   }) ?? []

  //   return await ctx.prisma.issue
  //     .create({
  //       data: {
  //         name: input.title,
  //         description: input.description,
  //         userId: ctx.session?.user.id,
  //         projectId: ctx.project.id,
  //         labels: {
  //           connect: mapped
  //         }
  //       }
  //     })
  // }),

  deleteIssue: ensureUserIsAuthorizedForIssue.input(z.object({
    issueId: z.string().uuid(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.issue
      .delete({
        where: {
          id: input.issueId
        }
      })
  }),

  updateIssue: ensureUserIsAuthorizedForIssue.input(ModifyIssueSchema).mutation(async ({ ctx, input }) => {
    const mapped = input.labels?.map((label) => {
      return {
        name: label,
      }
    }) ?? []

    return await prisma.issue
      .update({
        where: {
          id: ctx.issue.id
        },
        data: {
          name: input.title,
          description: input.description,
          open: true,
          // pinned, // TODO: Come back to this
          labels: {
            set: mapped
          }
        }
      })
  }),

  createComment: getIssue.input(commentCreationSchema).mutation(async ({ ctx, input }) => {
    return await prisma.comment
      .create({
        data: {
          description: input.description,
          userId: ctx.session?.user.id,
          issueId: ctx.issue.id
        }
      })
  }),

  updateComment: getViewableProject.input(commentCreationSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.comment
      .update({
        where: {
          id: input.commentId,
          OR: [{
            userId: ctx.session?.user.id,
          },
          {
            issue: {
              project: {
                id: ctx.project.id,
                members: {
                  some: {
                    userId: ctx.session?.user.id,
                    role: "Owner"
                  }
                }
              }
            }
          }]
        },
        data: {
          description: input.description,
        }
      })
  }),

  deleteComment: ensureUserIsAuthorizedForComment.input(commentCreationSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.comment
    .delete({
      where: {
        id: input.commentId,
        OR: [{
          userId: ctx.session?.user.id,
        },
        {
          issue: {
            project: {
              id: ctx.project.id,
              members: {
                some: {
                  userId: ctx.session?.user.id,
                  role: "Owner"
                }
              }
            }
          }
        }]
      }
    })
  }),

  getComments: getViewableProject.input(GetIssueSchema).mutation(async ({ ctx, input }) => {
    return await prisma.comment.findMany({
      where: {
        issueId: input.issueId
      }
    })
  })
})
