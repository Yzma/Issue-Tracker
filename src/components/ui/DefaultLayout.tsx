import { PropsWithChildren } from 'react'
import Header from '../Header'

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          {children}
        </div>
      </div>
    </main>
  )
}
