import React from 'react'
import Link from 'next/link'
import ProjectList from '../projects/ProjectList'
import { Button } from '../ui/button'
import { trpc } from '@/lib/trpc/trpc'

function OrganizationPage({ organizationName }: { organizationName: string }) {
  // This was fetched in getServerSideProps and will be available from the start
  const getOrganizationQuery =
    trpc.organizations.getOrganizationNonEnsure.useQuery({
      name: organizationName,
    })

  const getOrganizationProjectsQuery = trpc.organizations.getProjects.useQuery({
    name: organizationName,
    limit: 10,
  })

  return (
    <div className="md:flex gap-x-7 px-3 ">
      <div className="w-full">
        {getOrganizationProjectsQuery.isLoading ||
        !getOrganizationProjectsQuery.data ? (
          // TODO: Loading
          <>Loading organization projects...</>
        ) : (
          <ProjectList
            projects={getOrganizationProjectsQuery.data}
            projectCreationButton={
              getOrganizationQuery.data?.members !== undefined ? (
                <Button size="sm" asChild className="flex w-[7.5rem]">
                  <Link href="/login">Create Project</Link>
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  )
}

export default OrganizationPage
