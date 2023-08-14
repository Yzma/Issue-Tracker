import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { OrganizationRole } from '@prisma/client'
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'
import { getProjects, getProjectsWithInvitations } from './common'

const OrganizationMemberSchema = NamespaceSchema.and(
  z.object({
    username: NamespaceSchema,
  })
)

const ensureUserIsOrganizationMember = (
  role: OrganizationRole = OrganizationRole.User
) =>
  privateProcedure.input(NamespaceSchema).use(async ({ ctx, input, next }) => {
    const foundMember = await ctx.prisma.member.findFirst({
      where: {
        userId: ctx.session.user.id,
        role,
        organization: {
          name: {
            equals: input.name,
            mode: 'insensitive',
          },
        },
        NOT: {
          acceptedAt: {
            equals: null,
          },
        },
      },
    })

    if (!foundMember) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `You are not authorized to perform this action.`,
      })
    }

    return next({
      ctx: {
        ...ctx,
        member: foundMember,
      },
    })
  })

export const organizationsRouter = createTRPCRouter({
  createOrganization: privateProcedure
    .input(NamespaceSchema)
    .mutation(async ({ ctx, input }) => {
      const finalOrganizationName = input.name.toLowerCase()

      return ctx.prisma.organization.create({
        data: {
          name: finalOrganizationName,
          userId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: 'Owner',
              acceptedAt: new Date(),
            },
          },
          namespace: {
            create: {
              name: finalOrganizationName,
            },
          },
        },
      })
    }),

  updateOrganization: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(NamespaceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.organization.update({
        where: {
          name: input.name,
        },
        data: {
          name: input.name,
          namespace: {
            update: {
              name: input.name,
            },
          },
        },
      })
    }),

  getOrganizationNonEnsure: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      const signedInUserSelect =
        ctx.session?.user.id !== undefined
          ? {
              where: {
                userId: ctx.session.user.id,
              },
              select: {
                id: true,
                role: true,
              },
              take: 1,
            }
          : false

      const org = await ctx.prisma.organization.findFirst({
        where: {
          name: {
            equals: input.name,
            mode: 'insensitive',
          },
        },

        select: {
          id: true,
          name: true,
          createdAt: true,
          members: signedInUserSelect,
        },
      })

      if (!org) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided name was not found.`,
        })
      }

      return {
        ...org,
        members: org.members !== undefined ? org.members[0] : undefined,
      }
    }),

  inviteMember: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(OrganizationMemberSchema)
    .mutation(async () => {}),

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

      // The user is logged in, look them up to see if they are apart of the organization
      const foundMember = await ctx.prisma.member.findFirst({
        where: {
          userId: ctx.session.user.id,
          organization: {
            name: {
              equals: input.name,
              mode: 'insensitive',
            },
          },
        },
      })

      // The user is apart of the organization, show them all the projects
      if (foundMember) {
        return getProjects(input.name, true)
      }

      // This had to manually be written as the old implementation produced over 15 SELECT statements.
      // Here, we return public projects, and projects the user was invited to
      return getProjectsWithInvitations(input.name, ctx.session.user.id)
      // return ctx.prisma.$queryRaw`
      // SELECT "Project".*, "Namespace"."name" as namespaceName
      // FROM public."Project"
      // INNER JOIN public."Namespace" ON "Namespace".id = "Project"."namespaceId"
      // WHERE LOWER("Namespace"."name") = LOWER(${input.name})
      // AND (
      //     "Project".private = 'false'
      //     OR EXISTS (
      //         SELECT 1
      //         FROM public."Member"
      //         WHERE "Member"."projectId" = "Project".id
      //         AND "Member"."userId" = ${ctx.session.user.id}
      //         AND "Member"."acceptedAt" IS NOT NULL
      //     )
      // );
      // `
      // return ctx.prisma.project.findMany({
      //   where: {
      //     namespace: {
      //       name: {
      //         equals: input.name,
      //         mode: 'insensitive',
      //       },
      //     },
      //     OR: [
      //       {
      //         private: false,
      //       },

      //       {
      //         members: {
      //           some: {
      //             acceptedAt: {
      //               not: null,
      //             },
      //             userId: ctx.session.user.id,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // })
    }),

  getMembers: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.member.findMany({
        where: {
          organization: {
            name: {
              equals: input.name,
              mode: 'insensitive',
            },
          },

          NOT: {
            acceptedAt: {
              equals: null,
            },
          },
        },

        select: {
          id: true,
          acceptedAt: true,
          role: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      })
    }),

  getOutgoingInvites: ensureUserIsOrganizationMember(
    OrganizationRole.Owner
  ).query(async ({ ctx, input }) => {
    return ctx.prisma.member.findMany({
      where: {
        organization: {
          name: {
            equals: input.name,
            mode: 'insensitive',
          },
        },
        acceptedAt: {
          equals: null,
        },
      },

      select: {
        id: true,
        acceptedAt: true,
        role: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    })
  }),

  cancelInvite: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(
      NamespaceSchema.and(
        z.object({
          id: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.delete({
        where: {
          id: input.id,
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

  removeMember: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(OrganizationMemberSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.deleteMany({
        where: {
          user: {
            name: {
              equals: input.name,
              mode: 'insensitive',
            },
          },
          // TODO: Test this
          // New
          NOT: {
            acceptedAt: {
              equals: null,
            },
          },
          // Old:
          // AND: [
          //   {
          //     NOT: {
          //       acceptedAt: null,
          //     },
          //   },
          // ],
        },
      })
    }),

  updateMemberRole: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(
      OrganizationMemberSchema.and(
        z.object({
          role: z.nativeEnum(OrganizationRole),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.updateMany({
        where: {
          user: {
            name: {
              equals: input.name,
              mode: 'insensitive',
            },
          },
          NOT: {
            acceptedAt: {
              equals: null,
            },
          },
        },
        data: {
          role: input.role,
        },
      })
    }),

  deleteOrganization: ensureUserIsOrganizationMember(OrganizationRole.Owner)
    .input(NamespaceSchema)
    .mutation(async () => {}),
})
