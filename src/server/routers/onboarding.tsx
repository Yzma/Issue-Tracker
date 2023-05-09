import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { v4 as uuidv4 } from 'uuid';
import { decodeToken } from "@/lib/jwt"
import { NEW_USER_COOKIE } from "@/lib/constants"

// TODO: Move to constants
const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const profileCreationSchema = z.object({
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
})

export const projectsRouter = createTRPCRouter({

  submitUsername: publicProcedure.input(profileCreationSchema).mutation(async ({ ctx, input }) => {
    const cookie = ctx.req.cookies[NEW_USER_COOKIE]

    if (!cookie) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `You are unable to perform this action.`,
      })
    }
  
    return await decodeToken(cookie)
      .then(token => {
        
        return ctx.prisma.$transaction(async (tx) => {
         
          const updateResult = await tx.user.update({
            where: {
              id: token.data,
              AND: [
                {
                  username: null
                }
              ]
            },
            data: {
              username: input.name,
              namespace: {
                create: {
                  name: input.name
                }
              }
            }
          })

          if(!updateResult) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `User not found.`,
            })
          }

          return await tx.session.create({
            data: {
              sessionToken: uuidv4(),
              userId: updateResult.id,
              expires: fromDate(24 * 60 * 60)
            }
          })  
        })

      }).catch(() => {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: `Invalid JWT token.`,
        })
      })
    })
})

function fromDate(time: number, date = Date.now()) {
  return new Date(date + time * 1000)
}
