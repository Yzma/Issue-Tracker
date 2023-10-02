import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'

export const namespaceRouter = createTRPCRouter({
  getNamespace: publicProcedure
    .input(NamespaceSchema)
    .query(async ({ ctx, input }) => {
      const namespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.name,
        },
      })

      if (!namespace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided name was not found.`,
        })
      }

      // Check if the namespace is valid. A namespace can only have an organizationId or a userId. It can't have both, it must have one.
      if (
        (!namespace.organizationId && !namespace.userId) ||
        (namespace.organizationId && namespace.userId)
      ) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Invalid namespace`,
        })
      }

      return namespace
    }),
})
