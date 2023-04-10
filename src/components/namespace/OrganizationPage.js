import React, { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"

import OrgProjectSection from "@/components/OrgProjectSection"
import Tabs from "@/components/OrgPageTabs"
import UserSection from "@/components/OrgUserSection"
import OrganizationBelowNavbar from "../navbar/OrganizationBelowNavbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug } from "@fortawesome/free-solid-svg-icons"

const OrganizationPage = ({ props }) => {
  const router = useRouter()
  const { namespaceName } = router.query
  console.log("Org props ", props)

  const [activeTab, setActiveTab] = useState("projects")

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const projects = props.data.namespace.projects
  console.log("ORG PROJECT", projects)
  console.log("ORG", props)
  return (
    <>
      <Head>
        <title>{props.data.name}</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <OrganizationBelowNavbar
        namespaceName={namespaceName}
        selected={"projects"}
      />

      <div className={`mt-9`}>
        {" "}
        {/* Add the mt-4 class here */}
        {/* <Tabs activeTab={activeTab} onTabClick={handleTabClick} /> */}
        <OrgProjectSection projects={projects} />
      </div>
    </>
  )
}

export default OrganizationPage
