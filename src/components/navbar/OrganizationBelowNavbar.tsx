import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import moment from 'moment'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu'
import { MenuItem } from './types'

export type OrganizationBelowNavbarProps = {
  namespaceName: string
  creationDate: Date
  variant: 'full' | 'small'
  menuItems: MenuItem[]
}

// TODO: Make this reusable
function OrganizationBelowNavbar({
  namespaceName,
  creationDate,
  variant,
  menuItems,
}: OrganizationBelowNavbarProps) {
  const pathname = usePathname()
  return (
    <div className="z-10 border-b-2 border-gray-300 pt-4 pb-2">
      <div className="flex flex-row gap-x-4">
        {/* TODO: Clean this up */}

        <div className="mx-auto w-full space-y-4 sm:px-6 lg:px-8">
          <div className="flex flex-row pl-2">
            {variant === 'full' && (
              <div className="flex gap-x-5">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarFallback className="rounded-lg border border-gray-300 bg-white text-4xl">
                    {namespaceName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <p className="text-2xl font-bold">{namespaceName}</p>
                  <p className="text-lg">
                    Created {moment(creationDate).format('MMMM Do YYYY')}
                  </p>
                </div>
              </div>
            )}
            {variant === 'small' && (
              <div className="flex gap-x-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="rounded-lg border border-gray-300 bg-white text-2xl">
                    {namespaceName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-bold">{namespaceName}</p>
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
                          <div className="relative flex flex-row rounded px-2 py-2 hover:bg-gray-300">
                            {(menuItem.isActive
                              ? menuItem.isActive(pathname)
                              : pathname === menuItem.href) && (
                              <div className="absolute top-[calc(50%+27px)] left-0 z-30 h-[3px] w-full rounded-md bg-orange-500" />
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
