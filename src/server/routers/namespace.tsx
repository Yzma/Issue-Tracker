import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'

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
        const userResponse = await ctx.prisma.user.findUnique({
          where: {
            id: namespace.userId,
          },

          select: {
            namespace: {
              select: {
                projects: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    private: isUserViewingOwnProfile,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        })

        return {
          type: 'User',
          user: {
            ...userResponse,
          },
        }
      }
      if (namespace.organizationId) {
        const foundMember = await ctx.prisma.member.findFirst({
          where: {
            userId: ctx.session?.user?.id,
          },
        })

        const organizationResponse = await ctx.prisma.organization.findUnique({
          where: {
            id: namespace.organizationId,
          },

          select: {
            name: true,
            createdAt: true,
            namespace: {
              where: {
                id: namespace.id,
              },

              select: {
                projects: {
                  select: {
                    name: true,
                    description: true,
                    private: !foundMember,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        })

        return {
          type: 'Organization',
          organization: {
            ...organizationResponse,
          },
        }
      }
    }),
})
