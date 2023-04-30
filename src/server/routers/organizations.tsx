import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"

// TODO: Move to constants
const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const organizationSchema = z.object({
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
})

// const getOrganizationFromName = publicProcedure.input(organizationSchema).use(async ({ ctx, input, next }) => {

//   const foundOrganization = await ctx.prisma.organization
//     .findFirst({
//       where: {
//         name: input.name,
//       }
//     })

//   if (!foundOrganization) {
//     throw new TRPCError({
//       code: "NOT_FOUND",
//       message: `The queried organization was not found.`,
//     })
//   }

//   return next({
//     ctx: {
//       organization: foundOrganization
//     }
//   })
// })

const ensureUserIsMember = (role: OrganizationRole = OrganizationRole.User) => privateProcedure.input(organizationSchema).use(async ({ ctx, input, next }) => {

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

  createOrganization: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {
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

  updateOrganization: ensureUserIsMember(OrganizationRole.Owner).input(organizationSchema).mutation(async ({ ctx, input }) => {
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

  getMembers: publicProcedure.input(organizationSchema).query(async ({ ctx, input }) => {
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

  inviteMember: ensureUserIsMember(OrganizationRole.Owner).input(organizationSchema.and(z.object({
    username: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
  }))).mutation(async ({ ctx, input }) => {
   
  }),

  getOutgoingInvites: privateProcedure.input(organizationSchema).query(async ({ ctx, input }) => {
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

  cancelInvite: privateProcedure.input(organizationSchema.and(z.object({
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

  removeMember: privateProcedure.input(organizationSchema.and(z.object({
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

  updateMemberRole: privateProcedure.input(organizationSchema.and(z.object({
    id: z.string(),
    role: z.nativeEnum(OrganizationRole)
  }))).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.member.update({
      where: {
        id: input.id,
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

  deleteOrganization: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  })
})
