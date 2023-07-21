import React from 'react'
import { useRouter } from 'next/router'

import Link from 'next/link'
import OrganizationBelowNavbar from '../navbar/OrganizationBelowNavbar'
import { OrganizationResponse } from '@/types/types'
import ProjectList from '../projects/ProjectList'
import { Button } from '../ui/button'
import DefaultLayout from '../ui/DefaultLayout'

function OrganizationPage({ data }: { data: OrganizationResponse }) {
  const router = useRouter()
  const { namespaceName } = router.query

  return (
    <DefaultLayout
      underHeader={
        <OrganizationBelowNavbar
          namespaceName={namespaceName as string}
          selected="projects"
        />
      }
    >
      <div className="md:flex gap-x-7 px-3 ">
        <div className="w-full">
          <ProjectList
            projects={data.organization.projects}
            projectCreationButton={
              <Button size="sm" asChild className="flex w-[7.5rem]">
                <Link href="/login">Create Project</Link>
              </Button>
            }
          />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default OrganizationPage
