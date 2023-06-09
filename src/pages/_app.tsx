/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import { trpc } from '@/lib/trpc'
import '@fortawesome/fontawesome-svg-core/styles.css'

import '@/styles/globals.css'
import '@/styles/popover-styles.css'

config.autoAddCss = false

const MyApp: AppType<{ session: Session | null }> = ({
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
