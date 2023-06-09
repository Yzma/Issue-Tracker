import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { decodeToken } from '@/lib/jwt'
import { NEW_USER_COOKIE } from '@/lib/constants'
import { NamespaceSchema } from '@/lib/zod-schemas'

function fromDate(time: number, date = Date.now()) {
  return new Date(date + time * 1000)
}

export const onboardingRouter = createTRPCRouter({
  submitUsername: publicProcedure
    .input(NamespaceSchema)
    .mutation(async ({ ctx, input }) => {
      const cookie = ctx.req.cookies[NEW_USER_COOKIE]

      if (!cookie) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You are unable to perform this action.`,
        })
      }

      return decodeToken(cookie)
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

            return tx.session.create({
              data: {
                sessionToken: uuidv4(),
                userId: updateResult.id,
                expires: fromDate(24 * 60 * 60),
              },
            })
          })
        })
        .catch(() => {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: `Invalid JWT token.`,
          })
        })
    }),
})
