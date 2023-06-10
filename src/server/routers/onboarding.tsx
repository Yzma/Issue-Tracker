import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'
import { Prisma } from '@prisma/client'
import { deleteCookie, setCookie } from 'cookies-next'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { decodeToken } from '@/lib/jwt'
import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'
import { NamespaceSchema } from '@/lib/zod-schemas'

function fromDate(time: number, date = Date.now()) {
  return new Date(date + time * 1000)
}

export const onboardingRouter = createTRPCRouter({
  submitUsername: publicProcedure
    .input(NamespaceSchema)
    .mutation(async ({ ctx, input }) => {
      const cookie = ctx.req.cookies[NEW_USER_COOKIE]

      if (!cookie || ctx.req.cookies[NEXT_AUTH_SESSION_COOKIE]) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You are unable to perform this action.`,
        })
      }

      return (
        decodeToken(cookie)
          .catch(() => {
            throw new TRPCError({
              code: 'PARSE_ERROR',
              message: `Invalid JWT token.`,
            })
          })
          .then((token) => {
            return ctx.prisma.$transaction(async (tx) => {
              const updateResult = await tx.user.update({
                where: {
                  id: token.payload.data as string,
                  AND: [
                    {
                      username: null,
                    },
                  ],
                },
                data: {
                  username: input.name,
                  namespace: {
                    create: {
                      name: input.name,
                    },
                  },
                },
              })

              if (!updateResult) {
                throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: `User not found.`,
                })
              }

              const newSession = await tx.session.create({
                data: {
                  sessionToken: uuidv4(),
                  userId: updateResult.id,
                  expires: fromDate(24 * 60 * 60),
                },
              })

              const { req } = ctx
              const { res } = ctx
              deleteCookie(NEW_USER_COOKIE, { req, res })
              setCookie(NEXT_AUTH_SESSION_COOKIE, newSession.sessionToken, {
                req,
                res,
              })
              setCookie(
                `__Secure-${NEXT_AUTH_SESSION_COOKIE}`,
                newSession.sessionToken,
                {
                  req,
                  res,
                }
              )

              return {
                id: updateResult.id,
                username: input.name,
              }
            })
          })
          // TODO: Clean up
          .catch((error) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                throw new TRPCError({
                  code: 'CONFLICT',
                  message: `Another user already claimed that username. Please choose a different username.`,
                })
              }
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Internal server error. Please try again later.`,
            })
          })
      )
    }),
})
