import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBug,
  faEnvelope,
  faPaperPlane,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import BelowNavbar from './BelowNavbar'

function OrganizationBelowNavbar({ namespaceName, selected }) {
  return (
    <BelowNavbar>
      <BelowNavbar.BreadcrumbLinks>
        <BelowNavbar.BreadcrumbLink>
          <Link href={`/${namespaceName}`}>{namespaceName}</Link>
        </BelowNavbar.BreadcrumbLink>
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
          id="invite"
          href={`/orgs/${namespaceName}/invite`}
        >
          <div>
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="pl-2">Invite</div>
        </BelowNavbar.MenuListItem>

        <BelowNavbar.MenuListItem
          id="invites"
          href={`/orgs/${namespaceName}/members/invites`}
        >
          <div>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
          <div className="pl-2">Outgoing Invites</div>
        </BelowNavbar.MenuListItem>
      </BelowNavbar.MenuList>
    </BelowNavbar>
  )
}

export default OrganizationBelowNavbar
