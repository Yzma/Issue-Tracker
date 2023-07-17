import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  ensureUserIsProjectMember,
  getViewableIssue,
  getViewableProject,
} from '../trpc'
import { CreateIssueSchema, GetIssueSchema } from '@/lib/zod-schemas'
import { SortTypeSchema } from '@/lib/zod-types'
import { sort } from './types'

const ModifyIssueSchema = GetIssueSchema.and(CreateIssueSchema).and(
  z.object({
    pinned: z.boolean().optional(),
    open: z.boolean().optional(),
  })
)

function mapIssues(labels: string[] | undefined) {
  return (
    labels?.map((label) => {
      return {
        name: label,
      }
    }) ?? []
  )
}

const ensureUserIsAuthorizedForIssue = getViewableIssue
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
      },
    })
  })

export const issuesRouter = createTRPCRouter({
  getIssue: getViewableProject
    .input(GetIssueSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.issue.findUnique({
        where: {
          id: input.issueId,
        },
      })
    }),

  // TODO: Make this a common type
  getAllIssues: getViewableProject
    .input(
      z.object({
        open: z.boolean(),
        sort: SortTypeSchema,
        limit: z.number().int().max(25).default(15),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.issue.findMany({
        where: {
          projectId: ctx.project.id,
          open: input.open,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          open: true,
          labels: true,
          user: {
            select: {
              username: true,
            },
          },
          project: {
            select: {
              name: true,
              namespace: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          ...sort[input.sort],
        },
        take: input.limit,
      })
    }),

  createIssue: ensureUserIsProjectMember
    .input(CreateIssueSchema)
    .mutation(async ({ ctx, input }) => {
      const mapped = mapIssues(input.labels)

      return ctx.prisma.issue.create({
        data: {
          name: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          projectId: ctx.project.id,
          labels: {
            connect: mapped,
          },
        },
      })
    }),

  deleteIssue: ensureUserIsAuthorizedForIssue
    .input(
      z.object({
        issueId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.issue.delete({
        where: {
          id: input.issueId,
        },
      })
    }),

  updateIssue: ensureUserIsAuthorizedForIssue
    .input(ModifyIssueSchema)
    .mutation(async ({ ctx, input }) => {
      const mapped = mapIssues(input.labels)

      return ctx.prisma.issue.update({
        where: {
          id: ctx.issue.id,
        },
        data: {
          name: input.title,
          description: input.description,
          open: input.open,
          pinned: input.pinned,
          labels: {
            set: mapped,
          },
        },
      })
    }),
})
