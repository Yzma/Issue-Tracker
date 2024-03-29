import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc'
import { SortTypeSchema } from '@/lib/zod-types'
import { NamespaceSchema, UserProfileSchema } from '@/lib/zod-schemas'
import { sort } from './types'
import { getProjects, getProjectsWithInvitations } from './common'

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: {
            equals: input.name,
            mode: 'insensitive',
          },
        },

        select: {
          username: true,
          bio: true,
          socialLinks: true,
          image: true,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided name was not found.`,
        })
      }

      return user
    }),

  updateProfile: privateProcedure
    .input(UserProfileSchema)
    .mutation(async ({ ctx, input }) => {
      let socialLinks: string[] | undefined
      if (Array.isArray(input.socialLinks)) {
        socialLinks = input.socialLinks.filter(Boolean) as string[]
      } else {
        socialLinks = undefined
      }
      const t = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          bio: input.bio,
          socialLinks,
        },
      })
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
        acceptedAt: null,
      },

      select: {
        id: true,
        role: true,
        createdAt: true,
        inviteeUser: {
          select: {
            username: true,
          },
        },
        organization: {
          select: {
            name: true,
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
    })
  }),

  acceptInvite: privateProcedure
    .input(
      z.object({
        inviteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.update({
        where: {
          id: input.inviteId,
          userId: ctx.session.user.id,
          acceptedAt: null,
        },

        data: {
          acceptedAt: new Date(),
        },
      })
    }),

  deleteInvite: privateProcedure
    .input(
      z.object({
        inviteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.delete({
        where: {
          id: input.inviteId,
          userId: ctx.session.user.id,
          acceptedAt: null,
        },
      })
    }),

  getOwnOrganizations: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return ctx.prisma.$queryRaw<{ name: string }[]>`
    SELECT "Organization".name
    FROM public."Organization"
    INNER JOIN public."Member" ON "Member"."organizationId" = "Organization"."id"
    WHERE "Member"."userId" = ${userId};`
  }),

  getUsersOrganizations: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<{ name: string }[]>`
        SELECT "Organization".name
        FROM public."Organization"
        INNER JOIN public."Member" ON "Member"."organizationId" = "Organization"."id"
        INNER JOIN public."User" ON "Member"."userId" = "User"."id"
        WHERE "User"."username" = ${input.name}`
    }),

  getProjects: publicProcedure
    .input(
      NamespaceSchema.and(
        z.object({
          limit: z.number().int().max(25).default(15),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      // If the user isn't logged in, only return back public projects
      if (!ctx.session) {
        return getProjects(input.name, false)
      }

      // Return all projects if the viewer is viewing their own profile
      if (ctx.session.user.username === input.name) {
        return getProjects(input.name, true)
      }

      // This had to manually be written as the old implementation produced over 15 SELECT statements.
      // Here, we return public projects, and projects the user was invited to
      return getProjectsWithInvitations(input.name, ctx.session.user.id)
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
      })
    }),
})
