import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import OrgProjectSection from '@/components/OrgProjectSection'
import OrganizationBelowNavbar from '../navbar/OrganizationBelowNavbar'
import { OrganizationProps } from '@/types/types'

function OrganizationPage({ data }: { data: OrganizationProps }) {
  const router = useRouter()
  const { namespaceName } = router.query
  console.log('Org props ', data)

  const projects = []
  return (
    <>
      <Head>
        <title />
        <meta name="description" content="TODO: Description?" />
      </Head>

      <OrganizationBelowNavbar
        namespaceName={namespaceName}
        selected="projects"
      />

      <div className="mt-9">
        <OrgProjectSection projects={projects} />
      </div>
    </>
  )
}

export default OrganizationPage
