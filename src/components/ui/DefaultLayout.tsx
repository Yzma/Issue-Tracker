import { PropsWithChildren } from 'react'
import Header from '../Header'

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
