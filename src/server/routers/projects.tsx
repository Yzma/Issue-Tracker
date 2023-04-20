
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"
import { OrganizationRole } from "@prisma/client"

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

export const projectsRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({
      name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
      description: z.string().max(75).optional(),
      private: z.boolean().optional().default(false),
      namespaceName: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX) // TODO: Move this into separate schema
    }))
    .mutation(async ({ ctx, input }) => {

      const foundNamespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.namespaceName
        }
      })

      if (!foundNamespace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `The provided Namespace was not found.`,
        })
      }

      if (foundNamespace.userId) {

        if (foundNamespace.userId != ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You do not have permission to perform this action.`,
          })
        }

      } else if (foundNamespace.organizationId) {

        const foundMember = await ctx.prisma.member.findFirst({
          where: {
            userId: ctx.session.user.id,
            organizationId: foundNamespace.organizationId
          }
        })

        if (!foundMember || foundMember.role != OrganizationRole.Owner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You do not have permission to perform this action.`,
          })
        }
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `A Project was attempted to be created on a Namespace without a userId or organizationId.`,
        })
      }

      return await ctx.prisma.project
        .create({
          data: {
            name: input.name,
            description: input.description,
            private: input.private,
            namespaceId: foundNamespace.id,
            members: {
              create: {
                userId: ctx.session.user.id,
                role: "Owner" // TODO: Use Constant
              }
            },
            labels: {
              create: [
                { name: "Bug", description: "Bug description", color: "392029" },
                {
                  name: "Documentation",
                  description: "Documentation description",
                  color: "122b40"
                },
                {
                  name: "Duplicate",
                  description: "Duplicate description",
                  color: "373c43"
                }
              ]
            }
          }
        })
    })
})
