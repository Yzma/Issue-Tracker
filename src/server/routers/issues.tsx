import { TRPCError } from "@trpc/server"
import { getViewableProject, ensureUserIsMember } from "./projects"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"

// TODO: Move to constants
const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const issueSchema = z.object({
  owner: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
  project: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
  issueId: z.string(), // TODO: UUID
})

const issueCreationSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(2048),
  open: z.boolean(),
  labels: z.array(z.string().min(1).max(100)),
})

const commentSchema = issueCreationSchema.pick({
  description: true,
}).and(z.object({

}))

const commentCreationSchema = issueCreationSchema.pick({
  description: true,
}).and(z.object({
  commentId: z.string().uuid(),
}))

const getIssue = getViewableProject.input(issueSchema).use(async ({ ctx, input, next }) => {
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

const ensureUserIsAuthorizedForIssue = getIssue.input(issueSchema).use(async ({ ctx, input, next }) => {

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

const ensureUserIsAuthorizedForComment = getIssue.input(issueSchema).use(async ({ ctx, input, next }) => {

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

export const namespaceRouter = createTRPCRouter({

  // TODO: Move this into projects router?
  getIssue: getViewableProject.input(issueSchema).mutation(async ({ ctx, input }) => {
    return await prisma.issue.findUnique({
      where: {
        id: input.issueId
      }
    })
  }),

  createIssue: getViewableProject.input(issueSchema.and(issueCreationSchema)).mutation(async ({ ctx, input }) => {
    const mapped = input.labels.map((label) => {
      return {
        name: label,
      }
    })

    return await ctx.prisma.issue
      .create({
        data: {
          name: input.title,
          description: input.description,
          userId: ctx.session?.user.id,
          projectId: ctx.project.id,
          labels: {
            connect: mapped
          }
        }
      })
  }),

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

  updateIssue: ensureUserIsAuthorizedForIssue.input(issueCreationSchema).mutation(async ({ ctx, input }) => {
    const mapped = input.labels.map((label) => {
      return {
        name: label,
      }
    })
    return await prisma.issue
      .update({
        where: {
          id: ctx.issue.id
        },
        data: {
          name: input.title,
          description: input.description,
          open: input.open,
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

  getComments: getViewableProject.input(issueSchema).mutation(async ({ ctx, input }) => {
    return await prisma.comment.findMany({
      where: {
        issueId: input.issueId
      }
    })
  })
})
