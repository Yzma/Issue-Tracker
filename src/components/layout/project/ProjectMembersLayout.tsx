import { trpc } from '@/lib/trpc/trpc'
import { SidebarNav } from '@/components/sidebar/MembersSidebar'
import {
  OrganizationLayoutPageProps,
  OrganizationMemberLayoutProps,
} from '../organization/types'
import OrganizationLayout from '../organization/OrganizationLayout'

export default function OrganizationMembersLayout({
  children,
  organizationName,
}: OrganizationMemberLayoutProps) {
  const organizationMembersQuery =
    trpc.organizations.getOrganizationNonEnsure.useQuery({
      name: organizationName,
    })

  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="flex flex-col gap-y-4 -mx-4 lg:w-1/5">
          <SidebarNav
            items={[
              {
                title: 'Members',
                href: `/orgs/${organizationName}/members`,
              },
              {
                title: 'Pending Invitations',
                href: `/orgs/${organizationName}/invites`,
                shouldRender:
                  organizationMembersQuery.data?.members !== undefined, // organizationMembersQuery is fetched in getServerSideProps
              },
            ]}
          />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}

export const getOrganizationMembersLayout = ({
  page,
  organizationName,
  variant,
}: OrganizationLayoutPageProps) => {
  return (
    <OrganizationLayout organizationName={organizationName} variant={variant}>
      <OrganizationMembersLayout organizationName={organizationName}>
        {page}
      </OrganizationMembersLayout>
    </OrganizationLayout>
  )
}
