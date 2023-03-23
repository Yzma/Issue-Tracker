import React, { useState } from "react"

import layoutStyles from "@/styles/usersLayout.module.css"
import Head from "next/head"

import OrgProjectSection from "@/components/OrgProjectSection"
import Tabs from "@/components/OrgPageTabs"
import UserSection from "@/components/OrgUserSection"

const OrganizationPage = ({ props }) => {
  console.log("Orgh props ", props)

  const [activeTab, setActiveTab] = useState("projects")

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <>
      <Head>
        <title>{props.data.name}</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <div className={layoutStyles.projectSection}>
        <Tabs activeTab={activeTab} onTabClick={handleTabClick} />
        {activeTab === "projects" && (
          <OrgProjectSection projects={props.namespace.projects} />
        )}
        {activeTab === "users" && (
          <UserSection
            users={props.data.organizationMembers.map(
              (member) => member.user.username
            )}
          />
        )}
      </div>
    </>
  )
}

export default OrganizationPage