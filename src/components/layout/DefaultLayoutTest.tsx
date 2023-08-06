import { PropsWithChildren, ReactNode } from 'react'
import Header from '../Header'

type DefaultLayoutProps = PropsWithChildren & {
  underHeader?: ReactNode
}

export default function DefaultLayout({
  children,
  underHeader,
}: DefaultLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        {underHeader !== undefined && underHeader}
        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export const getLayout = (page: React.ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>
}
