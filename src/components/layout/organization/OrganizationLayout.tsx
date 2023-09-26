import { useMemo } from 'react'
import { faBug, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import DefaultLayout from '@/components/ui/DefaultLayout'
import { trpc } from '@/lib/trpc/trpc'
import { OrganizationLayoutPageProps, OrganizationLayoutProps } from './types'
import { MenuItem } from '@/components/navbar/types'
import OrganizationBelowNavbar from '@/components/navbar/OrganizationBelowNavbar'

export default function OrganizationLayout({
  children,
  organizationName,
  variant,
}: OrganizationLayoutProps) {
  const organizationMembersQuery =
    trpc.organizations.getOrganizationNonEnsure.useQuery({
      name: organizationName,
    })

  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        title: 'Projects',
        href: `/${organizationName}`,
        icon: faBug,
      },
      {
        title: 'Members',
        href: `/orgs/${organizationName}/members`,
        icon: faUserGroup,
        isActive: (pathname) =>
          pathname === `/orgs/${organizationName}/members` ||
          pathname === `/orgs/${organizationName}/invites`,
      },
      {
        title: 'Settings',
        href: `/orgs/${organizationName}/settings`,
        icon: faGear,
        shouldRender: organizationMembersQuery.data!.members !== undefined,
      },
    ]
  }, [organizationMembersQuery.data, organizationName])

  return (
    <DefaultLayout
      underHeader={
        <OrganizationBelowNavbar
          namespaceName={organizationName}
          creationDate={organizationMembersQuery.data?.createdAt as Date}
          menuItems={menuItems}
          variant={variant}
        />
      }
    >
      {children}
    </DefaultLayout>
  )
}

export const getOrganizationLayout = ({
  page,
  organizationName,
  variant,
}: OrganizationLayoutPageProps) => {
  return (
    <OrganizationLayout organizationName={organizationName} variant={variant}>
      {page}
    </OrganizationLayout>
  )
}
