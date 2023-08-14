import { TRPCClientErrorLike, httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'

import { Maybe, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { AppRouter } from '@/server/root'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${
      process.env.PORT ?? 3000
    }`

  return `http://localhost:${process.env.PORT ?? 3000}`
}
export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    const { ctx } = opts
    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
        queryClientConfig: {
          defaultOptions: {
            queries: {
              refetchOnMount: false,
              refetchOnWindowFocus: false,
              retry(failureCount, error) {
                const err = error as never as Maybe<
                  TRPCClientErrorLike<AppRouter>
                >
                const code = err?.data?.code
                if (
                  code === 'BAD_REQUEST' ||
                  code === 'FORBIDDEN' ||
                  code === 'UNAUTHORIZED'
                ) {
                  return false
                }
                const MAX_QUERY_RETRIES = 3
                return failureCount < MAX_QUERY_RETRIES
              },
            },
          },
        },
      }
    }
    return {
      transformer: superjson, // optional - adds superjson serialization
      links: [
        httpBatchLink({
          // The server needs to know your app's full url
          url: `${getBaseUrl()}/api/trpc`,
          /**
           * Set custom request headers on every request from tRPC
           * @link https://trpc.io/docs/v10/header
           */
          headers() {
            if (!ctx?.req?.headers) {
              return {}
            }
            // To use SSR properly, you need to forward the client's headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            const {
              // If you're using Node 18 before 18.15.0, omit the "connection" header
              // connection: _connection,
              ...headers
            } = ctx.req.headers
            return headers
          },
        }),
      ],
    }
  },
  ssr: false,
})
/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
