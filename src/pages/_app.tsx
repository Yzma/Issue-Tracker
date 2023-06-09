import { SessionProvider } from 'next-auth/react'

import { trpc } from '@/lib/trpc'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import '@/styles/globals.css'
import '@/styles/popover-styles.css'

import type { AppType } from 'next/app'

config.autoAddCss = false

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
