import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'
import { OrganizationResponse, UserResponse } from '@/types/types'

export const namespaceRouter = createTRPCRouter({
  getNamespace: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      const isUserViewingOwnProfile = ctx.session?.user?.name === input.name

      const namespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.name,
        },

        select: {
          id: true,
          name: true,
          userId: true,
          organizationId: true,
        },
      })

      if (!namespace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided name was not found.`,
        })
      }

      if (namespace.userId) {
        const projectSelectionQuery = isUserViewingOwnProfile
          ? {
              where: {
                private: false,
              },
            }
          : {}
        const userResponse = await ctx.prisma.user.findUnique({
          where: {
            id: namespace.userId,
          },

          select: {
            username: true,
            bio: true,
            socialLinks: true,
            image: true,
            namespace: {
              select: {
                projects: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    private: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                  ...projectSelectionQuery,
                },
              },
            },
            members: {
              where: {
                project: null,
              },
              select: {
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        })

        if (!userResponse) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `A namespace was found but no user could be found!`,
          })
        }

        return {
          type: 'User',
          user: {
            username: userResponse.username,
            bio: userResponse.bio,
            socialLinks: userResponse.socialLinks,
            image: userResponse.image,
            projects: userResponse.namespace?.projects.map((e) => {
              return {
                id: e.id,
                name: e.name,
                namespace: namespace.name,
                description: e.description,
                private: e.private,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
              }
            }),
            organizations: userResponse.members.map(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (e) => e.organization!.name
            ),
          },
          namespace: { ...namespace },
        } as UserResponse
      }
      if (namespace.organizationId) {
        const foundMember = !ctx.session?.user?.id
          ? null
          : await ctx.prisma.member.findFirst({
              where: {
                userId: ctx.session?.user?.id,
              },
            })

        const projectSelectionQuery = foundMember
          ? {
              where: {
                private: false,
              },
            }
          : {}

        const organizationResponse = await ctx.prisma.organization.findUnique({
          where: {
            id: namespace.organizationId,
          },

          select: {
            id: true,
            name: true,
            createdAt: true,
            namespace: {
              where: {
                id: namespace.id,
              },

              select: {
                projects: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    private: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                  ...projectSelectionQuery,
                },
              },
            },
          },
        })

        if (!organizationResponse) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `A namespace was found but no organization could be found!`,
          })
        }

        return {
          type: 'Organization',
          organization: {
            id: organizationResponse.id,
            name: organizationResponse.name,
            createdAt: organizationResponse.createdAt,
            projects: organizationResponse.namespace?.projects.map((e) => {
              return {
                id: e.id,
                name: e.name,
                namespace: namespace.name,
                description: e.description,
                private: e.private,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
              }
            }),
          },
          member: {
            role: foundMember?.role,
          },
          namespace: { ...namespace },
        } as OrganizationResponse
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `A namespace without a userId or organizationId was returned`,
      })
    }),
})
