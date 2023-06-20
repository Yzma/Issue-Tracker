import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '../trpc'
import { SortTypeSchema } from '@/lib/zod-types'
import { UserProfileSchema } from '@/lib/zod-schemas'
import { SortOptions } from './types'

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
    .input(UserProfileSchema)
    .mutation(async ({ ctx, input }) => {
      // const mappedSocialLinks = {
      //   socialLink1: input.socialLinks[0] ?? undefined,
      //   socialLink2: input.socialLinks[1] ?? undefined,
      //   socialLink3: input.socialLinks[2] ?? undefined,
      //   socialLink4: input.socialLinks[3] ?? undefined,
      // }
      const t = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          bio: input.bio,
          socialLinks: input.socialLinks ?? [],
        },
      })
      console.log('Database t ', t)
      return t
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
