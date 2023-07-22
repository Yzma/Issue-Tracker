import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import BelowNavbar from './BelowNavbar'
import { Avatar, AvatarFallback } from '../ui/avatar'

type OrganizationBelowNavbarProps = {
  namespaceName: string
  selected: string
}

function OrganizationBelowNavbar({
  namespaceName,
  selected,
}: OrganizationBelowNavbarProps) {
  return (
    <BelowNavbar>
      <BelowNavbar.BreadcrumbLinks>
        {/* TODO: Add variants  */}
        {/* <BelowNavbar.BreadcrumbLink>
          <Link href={`/${namespaceName}`}>{namespaceName}</Link>
        </BelowNavbar.BreadcrumbLink> */}
        <div className="flex gap-x-5">
          <Avatar className="rounded-lg h-24 w-24 ">
            <AvatarFallback className="text-4xl rounded-lg bg-white border border-gray-300">
              {namespaceName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p className="text-2xl font-bold">Title</p>
          </div>
        </div>
      </BelowNavbar.BreadcrumbLinks>

      <BelowNavbar.MenuList selected={selected}>
        <BelowNavbar.MenuListItem id="projects" href={`/${namespaceName}/`}>
          <div>
            <FontAwesomeIcon icon={faBug} />
          </div>
          <div className="pl-2">Projects</div>
        </BelowNavbar.MenuListItem>

        <BelowNavbar.MenuListItem
          id="members"
          href={`/orgs/${namespaceName}/members`}
        >
          <div>
            <FontAwesomeIcon icon={faUserGroup} />
          </div>
          <div className="pl-2">Members</div>
        </BelowNavbar.MenuListItem>

        <BelowNavbar.MenuListItem
          id="settings"
          href={`/orgs/${namespaceName}/settings`}
        >
          <div>
            <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="pl-2">Settings</div>
        </BelowNavbar.MenuListItem>
      </BelowNavbar.MenuList>
    </BelowNavbar>
  )
}

export default OrganizationBelowNavbar
