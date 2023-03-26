
import BelowNavbar from "./BelowNavbar"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBug,
  faTag,
  faEnvelope,
  faUserGroup
} from "@fortawesome/free-solid-svg-icons"

const ProjectBelowNavbar = ({namespaceName, projectName}) => {
  return (
    <BelowNavbar>
    <BelowNavbar.BreadcrumbLinks>
      <BelowNavbar.BreadcrumbLink>
        <Link href={`/${namespaceName}`}>
          {namespaceName}
        </Link>
      </BelowNavbar.BreadcrumbLink>

      <BelowNavbar.BreadcrumbLink>
        <Link href={`/${namespaceName}/${projectName}`}>
          {projectName}
        </Link>
      </BelowNavbar.BreadcrumbLink>
    </BelowNavbar.BreadcrumbLinks>

    <BelowNavbar.MenuList>

      <BelowNavbar.MenuListItem href={`/${namespaceName}/${projectName}`}>
        <div>
          <FontAwesomeIcon icon={faBug} />
        </div>
        <div className="pl-2">Issues</div>
      </BelowNavbar.MenuListItem>

      <BelowNavbar.MenuListItem href={`/${namespaceName}/${projectName}/labels`}>
        <div>
          <FontAwesomeIcon icon={faTag} />
        </div>
        <div className="pl-2">Labels</div>
      </BelowNavbar.MenuListItem>

      <BelowNavbar.MenuListItem href={`/${namespaceName}/${projectName}/members`}>
        <div>
          <FontAwesomeIcon icon={faUserGroup} />
        </div>
        <div className="pl-2">Members</div>
      </BelowNavbar.MenuListItem>

      <BelowNavbar.MenuListItem href={`/${namespaceName}/${projectName}/invite`}>
        <div>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <div className="pl-2">Invites</div>
      </BelowNavbar.MenuListItem>

    </BelowNavbar.MenuList>
  </BelowNavbar>
  )
}

export default ProjectBelowNavbar