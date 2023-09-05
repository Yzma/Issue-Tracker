import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu'
import { MenuItem } from './types'

export type ProjectBelowNavbarProps = {
  namespaceName: string
  projectName: string
  menuItems: MenuItem[]
}

// TODO: Make this reusable
function ProjectBelowNavbar({
  namespaceName,
  projectName,
  menuItems,
}: ProjectBelowNavbarProps) {
  const pathname = usePathname()
  return (
    <div className="pt-4 pb-2 border-b-2 border-gray-300 z-10">
      <div className="flex flex-row gap-x-4">
        {/* TODO: Clean this up */}

        <div className="sm:px-6 lg:px-8 w-full mx-auto space-y-4">
          <div className="flex flex-row pl-2">
            <Link href={`/${namespaceName}`}>
              <p className="text-2xl text-blue-600 hover:text-blue-900 hover:underline">
                {namespaceName}
              </p>
            </Link>

            <p className="text-2xl px-1 font-light">/</p>
            <Link href={`/${namespaceName}/${projectName}`}>
              <p className="text-2xl font-semibold text-blue-600 hover:text-blue-900 hover:underline">
                {projectName}
              </p>
            </Link>
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

export default ProjectBelowNavbar
