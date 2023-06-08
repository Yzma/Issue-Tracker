import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"
import { NamespaceSchema } from "@/lib/zod-schemas"

// // TODO: Move to constants
// const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

// const organizationSchema = z.object({
//   name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
// })

const OrganizationMemberSchema = NamespaceSchema.and(z.object({
  username: NamespaceSchema,
}))

const ensureUserIsMember = (role: OrganizationRole = OrganizationRole.User) => privateProcedure.input(NamespaceSchema).use(async ({ ctx, input, next }) => {

  const foundMember = await ctx.prisma.member.findFirst({
    where: {
      userId: ctx.session.user.id,
      role: role,
      organization: {
        name: input.name,
      },
      AND: [
        {
          NOT: {
            acceptedAt: null
          }
        }
      ]
    }
  })

  if (!foundMember) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `You are not authorized to perform this action.`,
    })
  }

  return next({
    ctx: {
      ...ctx,
      member: foundMember
    }
  })
})

export const organizationsRouter = createTRPCRouter({

  createOrganization: privateProcedure.input(NamespaceSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.organization
      .create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "Owner"
            }
          },
          namespace: {
            create: {
              name: input.name,
            }
          }
        }
      })
  }),

  updateOrganization: ensureUserIsMember(OrganizationRole.Owner).input(NamespaceSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.organization
      .update({
        where: {
          name: input.name,
        },
        data: {
          name: input.name,
          namespace: {
            update: {
              name: input.name,
            }
          }
        }
      })
  }),

  getMembers: publicProcedure.input(NamespaceSchema).query(async ({ ctx }) => {
    return await ctx.prisma.member.findMany({
      where: {
        AND: [
          {
            NOT: {
              acceptedAt: null
            }
          }
        ]
      }
    })
  }),

  inviteMember: ensureUserIsMember(OrganizationRole.Owner).input(OrganizationMemberSchema).mutation(async ({ ctx, input }) => {
   
  }),

  getOutgoingInvites: ensureUserIsMember(OrganizationRole.Owner).query(async ({ ctx }) => {
    return await ctx.prisma.member.findMany({
      where: {
        NOT: [
          {
            acceptedAt: null
          }
        ]
      }
    })
  }),

  cancelInvite: ensureUserIsMember(OrganizationRole.Owner).input(NamespaceSchema.and(z.object({
    id: z.string(),
  }))).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.member.delete({
      where: {
        id: input.id,
        AND: [
          {
            NOT: {
              acceptedAt: null
            }
          }
        ]
      }
    })
  }),

  removeMember: ensureUserIsMember(OrganizationRole.Owner).input(OrganizationMemberSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.member.delete({
      where: {
        user: {
          name: input.username
        },
        AND: [
          {
            NOT: {
              acceptedAt: null
            }
          }
        ]
      }
    })
  }),
  
  updateMemberRole: privateProcedure.input(OrganizationMemberSchema.and(z.object({
    role: z.nativeEnum(OrganizationRole)
  }))).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.member.update({
      where: {
        user: {
          name: input.username
        },
        AND: [
          {
            NOT: {
              acceptedAt: null
            }
          }
        ]
      },
      data: {
        role: input.role
      }
    })
  }),

  deleteOrganization: privateProcedure.input(NamespaceSchema).mutation(async ({ ctx, input }) => {

  })
})
