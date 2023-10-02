import React from 'react'
import { trpc } from '@/lib/trpc/trpc'
import { OrganizationPageProps } from './types'
import SharedProjectList from '../projects/SharedProjectList'
import { ProjectListProjectItem } from '../projects/types'
import { useGetOrganization } from '@/hooks/useGetOrganization'

export default function OrganizationPage({
  organizationName,
}: OrganizationPageProps) {
  // This was fetched in getServerSideProps and will be available from the start
  const getOrganizationQuery = useGetOrganization({ name: organizationName })

  const getOrganizationProjectsQuery = trpc.organizations.getProjects.useQuery({
    name: organizationName,
    limit: 10,
  })

  return (
    <div className="gap-x-7 px-3 md:flex ">
      <div className="w-full">
        <SharedProjectList
          loading={getOrganizationProjectsQuery.isLoading}
          createProjectLink={
            getOrganizationQuery.data?.members !== undefined
              ? `/projects/create?owner=${getOrganizationQuery.data?.name}`
              : undefined
          }
          projects={
            getOrganizationProjectsQuery.data as ProjectListProjectItem[]
          }
        />
      </div>
    </div>
  )
}
