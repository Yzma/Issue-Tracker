import { SidebarNav } from '@/components/sidebar/SidebarNav'
import ProjectLayout from './ProjectLayout'
import { ProjectLayoutPageProps, ProjectMemberLayoutProps } from './types'
import { useGetProject } from '@/hooks/useGetProject'

export default function ProjectMembersLayout({
  children,
  namespaceName,
  projectName,
}: ProjectMemberLayoutProps) {
  const getProjectQuery = useGetProject({
    owner: namespaceName,
    name: projectName,
  })
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 flex flex-col gap-y-4 lg:w-1/5">
          <SidebarNav
            items={[
              {
                title: 'Members',
                href: `/${namespaceName}/${projectName}/members`,
              },
              {
                title: 'Pending Invitations',
                href: `/${namespaceName}/${projectName}/invites`,
                shouldRender: getProjectQuery.data?.member !== undefined, // organizationMembersQuery is fetched in getServerSideProps
              },
            ]}
          />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}

export const getProjectMembersLayout = ({
  page,
  namespaceName,
  projectName,
}: ProjectLayoutPageProps) => {
  return (
    <ProjectLayout namespaceName={namespaceName} projectName={projectName}>
      <ProjectMembersLayout
        namespaceName={namespaceName}
        projectName={projectName}
      >
        {page}
      </ProjectMembersLayout>
    </ProjectLayout>
  )
}
