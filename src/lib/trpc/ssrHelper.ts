import { createServerSideHelpers } from '@trpc/react-query/server'
import superjson from 'superjson'
import { GetServerSidePropsContext } from 'next'
import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/server/trpc'

export default async function ssrHelper(context: GetServerSidePropsContext) {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson,
  })
}
