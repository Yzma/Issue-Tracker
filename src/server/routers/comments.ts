import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, getViewableIssue, getViewableProject } from '../trpc'
import {
  CommentCreationSchema,
  ProjectNamespaceSchema,
} from '@/lib/zod-schemas'

const GetIssueSchema = ProjectNamespaceSchema.and(
  z.object({
    issueId: z.string(),
  })
)

const ModifyCommentSchema = GetIssueSchema.and(
  z.object({
    commentId: z.string(),
  })
).and(CommentCreationSchema)

const ensureUserIsAuthorizedForComment = getViewableIssue
  .input(GetIssueSchema)
  .use(async ({ ctx, next }) => {
    if (
      ctx.issue.userId !== ctx.session?.user.id ||
      ctx.member?.role !== 'Owner'
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not authorized to perform this action',
      })
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    })
  })

export const commentsRouter = createTRPCRouter({
  createComment: getViewableIssue
    .input(ModifyCommentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authorized to perform this action',
        })
      }

      return ctx.prisma.comment.create({
        data: {
          description: input.description,
          userId: ctx.session.user.id,
          issueId: ctx.issue.id,
        },
      })
    }),

  updateComment: ensureUserIsAuthorizedForComment
    .input(ModifyCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.update({
        where: {
          id: input.commentId,
          OR: [
            {
              userId: ctx.session.user.id,
            },
            {
              issue: {
                project: {
                  id: ctx.project.id,
                  members: {
                    some: {
                      userId: ctx.session?.user.id,
                      role: 'Owner',
                    },
                  },
                },
              },
            },
          ],
        },
        data: {
          description: input.description,
        },
      })
    }),

  deleteComment: ensureUserIsAuthorizedForComment
    .input(ModifyCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
          OR: [
            {
              userId: ctx.session.user.id,
            },
            {
              issue: {
                project: {
                  id: ctx.project.id,
                  members: {
                    some: {
                      userId: ctx.session.user.id,
                      role: 'Owner',
                    },
                  },
                },
              },
            },
          ],
        },
      })
    }),

  getComments: getViewableProject
    .input(GetIssueSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.findMany({
        where: {
          issueId: input.issueId,
        },
      })
    }),
})
