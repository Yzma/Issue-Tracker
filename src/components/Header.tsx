import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug, faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Skeleton } from './ui/skeleton'

export default function Header() {
  const { data: session, status } = useSession()
  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-green-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="-mb-px flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faBug} size="2x" className="pr-2" />
              <div>Issue-Tracker</div>
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            {status === 'unauthenticated' && (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <a
                className="block px-4 py-2 text-gray-800 hover:cursor-pointer hover:text-gray-600"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signIn()}
              >
                Sign In
              </a>
            )}
            {status === 'loading' && (
              <div role="status" className="animate-pulse">
                <div className="flex items-center justify-center">
                  <Skeleton className="mr-3 h-2.5 w-20 rounded-full bg-slate-200" />
                  <Skeleton className="mr-2 h-10 w-10 rounded-full bg-slate-200" />
                </div>
              </div>
            )}
            {status === 'authenticated' && (
              <ul className="flex items-center space-x-3">
                <li className="flex gap-x-1 text-gray-500 hover:text-gray-600">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex gap-x-1 text-gray-500 hover:cursor-pointer hover:text-gray-600">
                        <FontAwesomeIcon icon={faPlus} />
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                      sideOffset={5}
                      side="top"
                      alignOffset={3}
                      avoidCollisions
                    >
                      <Link href="/projects/create">
                        <DropdownMenuItem className="group relative flex h-[25px] items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          New Project
                        </DropdownMenuItem>
                      </Link>

                      <Link href="/orgs/create">
                        <DropdownMenuItem className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          Create Organization
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li className="flex gap-x-1 text-gray-500 hover:text-gray-600">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center justify-center text-gray-500 hover:cursor-pointer hover:text-gray-600">
                        <Avatar className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                          <AvatarImage
                            className="h-8 w-8 rounded-[inherit] object-cover"
                            src={session.user.image ?? undefined}
                          />
                          <AvatarFallback
                            className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                            delayMs={600}
                          >
                            {session.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                      sideOffset={5}
                      side="top"
                    >
                      {/* There doesn't seem to be a way to full refresh when redirecting, Next.js serves a cached version.
                      If your on a users profile and use this button, the data from the last profile will be displayed. */}
                      <a href={`/${session.user.namespace.name}`}>
                        <DropdownMenuItem className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          Profile
                        </DropdownMenuItem>
                      </a>
                      <Link href="/issues">
                        <DropdownMenuItem className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          Issues
                        </DropdownMenuItem>
                      </Link>

                      <Link href="/invites">
                        <DropdownMenuItem className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          Invites
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSeparator className="m-[5px] h-[1px] bg-slate-300" />

                      <Link href="/settings">
                        <DropdownMenuItem className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer">
                          Settings
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSeparator className="m-[5px] h-[1px] bg-slate-300" />

                      <DropdownMenuItem
                        className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:cursor-pointer"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
