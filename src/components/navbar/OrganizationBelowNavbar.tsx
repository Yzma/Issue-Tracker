import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu'

export type OrganizationBelowNavbarProps = {
  namespaceName: string
  variant: 'full' | 'small'
  menuItems: MenuItem[]
}

export type MenuItem = {
  title: string
  href: string
  icon: IconDefinition
  isActive?: (pathname: string) => boolean
  shouldRender?: boolean
}

function OrganizationBelowNavbar({
  namespaceName,
  variant,
  menuItems,
}: OrganizationBelowNavbarProps) {
  const pathname = usePathname()
  return (
    <div className="pt-4 pb-2 border-b-2 border-gray-300 z-10">
      <div className="flex flex-row gap-x-4">
        {/* TODO: Clean this up */}

        <div className="sm:px-6 lg:px-8 w-full mx-auto space-y-4">
          <div className="flex flex-row pl-2">
            {variant === 'full' && (
              <div className="flex gap-x-5">
                <Avatar className="rounded-lg h-24 w-24">
                  <AvatarFallback className="text-4xl rounded-lg bg-white border border-gray-300">
                    {namespaceName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <p className="text-2xl font-bold">{namespaceName}</p>
                  <p className="text-lg">Created date here</p>
                </div>
              </div>
            )}
            {variant === 'small' && (
              <div className="flex gap-x-3">
                <Avatar className="rounded-lg h-10 w-10">
                  <AvatarFallback className="text-2xl rounded-lg bg-white border border-gray-300">
                    {namespaceName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-bold">Title</p>
                </div>
              </div>
            )}
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <div className="flex flex-row gap-x-4">
                {menuItems
                  .filter((menuItem) => menuItem.shouldRender ?? true)
                  .map((menuItem) => {
                    return (
                      <NavigationMenuItem key={menuItem.href}>
                        <Link href={menuItem.href}>
                          <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300 relative">
                            {(menuItem.isActive
                              ? menuItem.isActive(pathname)
                              : pathname === menuItem.href) && (
                              <div className="absolute top-[calc(50%+27px)] left-0 w-full h-[3px] rounded-md bg-orange-500 z-30" />
                            )}
                            <div>
                              <FontAwesomeIcon icon={menuItem.icon} />
                            </div>
                            <div className="pl-2">{menuItem.title}</div>
                          </div>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  )
}

export default OrganizationBelowNavbar
