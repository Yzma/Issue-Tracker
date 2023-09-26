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
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header />
        {underHeader !== undefined && underHeader}
        <main className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
