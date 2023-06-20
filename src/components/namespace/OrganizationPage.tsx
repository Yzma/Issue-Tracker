import React from 'react'
import { useRouter } from 'next/router'

import OrganizationBelowNavbar from '../navbar/OrganizationBelowNavbar'
import { OrganizationResponse } from '@/types/types'
import ProjectList from '../projects/ProjectList'

function OrganizationPage({ data }: { data: OrganizationResponse }) {
  const router = useRouter()
  const { namespaceName } = router.query

  return (
    <>
      <OrganizationBelowNavbar
        namespaceName={namespaceName}
        selected="projects"
      />

      <div className="mt-9">
        <ProjectList
          projects={data.organization.projects}
          showCreateProjectButton={
            !!(data.member.role && data.member.role !== 'User')
          }
        />
      </div>
    </>
  )
}

export default OrganizationPage
