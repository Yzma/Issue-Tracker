import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"

// TODO: Move to constants
const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const namespaceSchema = z.object({
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
})

export const namespaceRouter = createTRPCRouter({

  getNamespace: publicProcedure.input(namespaceSchema).query(async ({ ctx, input }) => {

    const isUserViewingOwnProfile = ctx.session?.user?.name === input.name

    const namespace = await ctx.prisma.namespace.findUnique({
      where: {
        name: input.name
      },

      select: {
        id: true,
        name: true,
        userId: true,
        organizationId: true,
      }
    })

    if(!namespace) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `The provided name was not found.`,
      })
  }

    if(namespace.userId) {

      const userResponse = await ctx.prisma.user.findUnique({
        where: {
          id: namespace.userId
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
                }
              }
            },
          }
        }
      })

      return {
        type: "User",
        user: {
          ...userResponse,
        },
      }

    } else if(namespace.organizationId) {

      const foundMember = await ctx.prisma.member.findFirst({
        where: {
          userId: ctx.session?.user?.id,
        },
      })

      const organizationResponse = await ctx.prisma.organization.findUnique({
        where: {
          id: namespace.organizationId
        },

        select: {
          name: true,
          createdAt: true,
          namespace: {
            where: {
              id: namespace.id
            },

            select: {
              projects: {
                select: {
                  name: true,
                  description: true,
                  private: foundMember ? false : true,
                  createdAt: true,
                  updatedAt: true,
                }
              }
            }
          }
        }
      })

      return {
        type: "Organization",
        organization: {
          ...organizationResponse,
        },
      }
    }
  })
})
