import { createServerSideHelpers } from '@trpc/react-query/server'
import superjson from 'superjson'
import { GetServerSidePropsContext } from 'next'
import { appRouter } from '@/server/root'
import prisma from '@/lib/prisma/prisma'

export default function ssrHelper(context: GetServerSidePropsContext) {
  return createServerSideHelpers({
    router: appRouter,
    ctx: {
      req: context.req,
      res: context.res,
      session: null,
      prisma,
    },
    transformer: superjson,
  })
}
