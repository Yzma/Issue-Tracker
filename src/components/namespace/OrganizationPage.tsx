import React, { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"

import OrgProjectSection from "@/components/OrgProjectSection"
import Tabs from "@/components/OrgPageTabs"
import UserSection from "@/components/OrgUserSection"
import OrganizationBelowNavbar from "../navbar/OrganizationBelowNavbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug } from "@fortawesome/free-solid-svg-icons"
import { OrganizationProps } from "@/types/types"

const OrganizationPage = ({ data }: { data: OrganizationProps }) => {
  const router = useRouter()
  const { namespaceName } = router.query
  console.log("Org props ", data)

  const projects = []
  return (
    <>
      <Head>
        <title>{""}</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <OrganizationBelowNavbar
        namespaceName={namespaceName}
        selected={"projects"}
      />

      <div className={`mt-9`}>
        <OrgProjectSection projects={projects} />
      </div>
    </>
  )
}

export default OrganizationPage
