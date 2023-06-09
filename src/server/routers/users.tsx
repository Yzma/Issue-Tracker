import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '../trpc'
import { SortTypeSchema } from '@/lib/zod-types'
import { NAMESPACE, SHORT_DESCRIPTION } from '@/lib/zod-schemas'
import { SortOptions } from './types'

const ProfileUpdateSchema = z.object({
  name: NAMESPACE,
  bio: SHORT_DESCRIPTION,
  socialLink1: z.string().max(75).optional(),
  socialLink2: z.string().max(75).optional(),
  socialLink3: z.string().max(75).optional(),
  socialLink4: z.string().max(75).optional(),
})

const sort: SortOptions = {
  newest: {
    createdAt: 'desc',
  },
  oldest: {
    createdAt: 'asc',
  },
  'recently-updated': {
    updatedAt: 'desc',
  },
  'least-recently-updated': {
    updatedAt: 'asc',
  },
}

export const usersRouter = createTRPCRouter({
  updateProfile: privateProcedure
    .input(ProfileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          bio: input.bio,
          socialLink1: input.socialLink1,
          socialLink2: input.socialLink2,
          socialLink3: input.socialLink3,
          socialLink4: input.socialLink4,
        },
      })
    }),

  getSessions: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.session.findMany({
      where: {
        id: ctx.session.user.id,
      },
    })
  }),

  deleteSession: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.session.delete({
        where: {
          id: input.id,
        },
      })
    }),

  getInvites: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.member.findMany({
      where: {
        userId: ctx.session.user.id,
        AND: [
          {
            NOT: {
              acceptedAt: null,
            },
          },
        ],
      },
    })
  }),

  getOrganizations: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.member.findMany({
      where: {
        userId: ctx.session.user.id,
        AND: [
          {
            project: null,
          },
        ],
      },

      select: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }),

  getGlobalIssues: privateProcedure
    .input(
      z.object({
        open: z.boolean(),
        sort: SortTypeSchema,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.issue.findMany({
        where: {
          userId: ctx.session.user.id,
          open: input.open,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
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
      })
    }),
})
