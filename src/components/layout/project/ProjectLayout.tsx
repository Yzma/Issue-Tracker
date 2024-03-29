import { useMemo } from 'react'
import {
  faBug,
  faGear,
  faTags,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import DefaultLayout from '@/components/ui/DefaultLayout'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'
import { ProjectLayoutPageProps, ProjectLayoutProps } from './types'
import { MenuItem } from '@/components/navbar/types'
import { useGetProject } from '@/hooks/useGetProject'

export default function ProjectLayout({
  children,
  namespaceName,
  projectName,
}: ProjectLayoutProps) {
  const getProjectQuery = useGetProject({
    owner: namespaceName,
    name: projectName,
  })

  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        title: 'Issues',
        href: `/${namespaceName}/${projectName}`,
        icon: faBug,
        isActive: (pathname) =>
          pathname === `/${namespaceName}/${projectName}` ||
          pathname === `/${namespaceName}/${projectName}/new` ||
          pathname.startsWith(`/${namespaceName}/${projectName}/issues`),
      },
      {
        title: 'Labels',
        href: `/${namespaceName}/${projectName}/labels`,
        icon: faTags,
      },
      {
        title: 'Members',
        href: `/${namespaceName}/${projectName}/members`,
        icon: faUserGroup,
        isActive: (pathname) =>
          pathname === `/${namespaceName}/${projectName}/members` ||
          pathname === `/${namespaceName}/${projectName}/invites`,
      },
      {
        title: 'Settings',
        href: `/${namespaceName}/${projectName}/settings`,
        icon: faGear,
        shouldRender: getProjectQuery.data?.member !== undefined,
      },
    ]
  }, [getProjectQuery.data, namespaceName, projectName])

  return (
    <DefaultLayout
      underHeader={
        <ProjectBelowNavbar
          namespaceName={namespaceName}
          projectName={projectName}
          menuItems={menuItems}
        />
      }
    >
      {children}
    </DefaultLayout>
  )
}

export const getProjectLayout = ({
  page,
  namespaceName,
  projectName,
}: ProjectLayoutPageProps) => {
  return (
    <ProjectLayout namespaceName={namespaceName} projectName={projectName}>
      {page}
    </ProjectLayout>
  )
}
