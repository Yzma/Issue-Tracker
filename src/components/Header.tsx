import Link from "next/link"
import * as Avatar from "@radix-ui/react-avatar"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug, faPlus, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { useSession, signIn, signOut } from "next-auth/react"

const Header = () => {
  const { data: session } = useSession()
  return (
    <header className="sticky top-0 bg-green-300 border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center text-gray-700 font-bold text-lg hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faBug} size="2x" className="pr-2" />
              <div>Bug-Zapper</div>
            </Link>
            <Link
              href="/globalissue"
              className="text-gray-600 font-bold hover:text-gray-800 hover:underline"
            >
              Issues
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            {session ? (
              <ul className="flex items-center space-x-3">
                <li className="flex gap-x-1 text-gray-500 hover:text-gray-600">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <div className="flex gap-x-1 text-gray-500 hover:text-gray-600">
                        <FontAwesomeIcon icon={faPlus} />
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-20"
                        sideOffset={5}
                        side={"top"}
                        alignOffset={3}
                        avoidCollisions={true}
                      >
                        <Link href="/projects/create">
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            New Project
                          </DropdownMenu.Item>
                        </Link>

                        <Link href="/orgs/create">
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Create Organization
                          </DropdownMenu.Item>
                        </Link>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </li>

                <li className="flex gap-x-1 text-gray-500 hover:text-gray-600">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <div className="flex items-center justify-center text-gray-500 hover:text-gray-600">
                        <Avatar.Root className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                          <Avatar.Image
                            className="h-8 w-8 rounded-[inherit] object-cover"
                            src={session.user.image}
                            alt={session.user.name}
                          />
                          <Avatar.Fallback
                            className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                            delayMs={600}
                          >
                            {session.user.name.charAt(0).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-20"
                        sideOffset={5}
                        side={"top"}
                      >
                        <Link href={`/${session.user.namespace.name}`}>
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Your Profile
                          </DropdownMenu.Item>
                        </Link>
                        <Link href={`/${session.user.namespace.name}/projects`}>
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Your Projects
                          </DropdownMenu.Item>
                        </Link>
                        <Link href={`/${session.user.namespace.name}/projects`}>
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Your Organizations
                          </DropdownMenu.Item>
                        </Link>

                        <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />

                        <Link href="/settings">
                          <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Settings
                          </DropdownMenu.Item>
                        </Link>

                        <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />

                        <DropdownMenu.Item
                          className="group text-[13px] hover:cursor-pointer leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          Sign Out
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </li>
              </ul>
            ) : (
              <a
                className="block px-4 py-2 text-gray-800 hover:text-gray-600 hover:cursor-pointer"
                onClick={() => signIn()}
              >
                Sign In
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
