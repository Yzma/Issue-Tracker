/* eslint-disable react/jsx-props-no-spreading */
import { ReactElement, ReactNode } from 'react'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '@/lib/trpc/trpc'
import '@fortawesome/fontawesome-svg-core/styles.css'

import '@/styles/globals.css'
import '@/styles/popover-styles.css'

config.autoAddCss = false

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)

  return (
    <SessionProvider session={session as Session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {layout}
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
