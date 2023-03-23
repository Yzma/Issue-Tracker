import React from "react"

import layoutStyles from "@/styles/usersLayout.module.css"
import ProfileContainer from "../ProfileContainer"
import ProjectSection from "../OrgProjectSection"
import Head from "next/head"

const UserPage = ({ props }) => {
  console.log("UserPage props ", props)
  return (
    <>
      <Head>
        <title>{props.data.username}'s Profile</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <div className={layoutStyles.profileContainer}>
        <ProfileContainer username={props.data.username} bio={""} />
      </div>
      <div className={layoutStyles.projectSection}>
        <ProjectSection projects={props.namespace.projects} />
      </div>
    </>
  )
}

export default UserPage
