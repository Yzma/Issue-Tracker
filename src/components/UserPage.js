import React from "react"
import styles from "../styles/ProjectSection.module.css"
import layoutStyles from "@/styles/usersLayout.module.css";
import ProfileContainer from "./ProfileContainer"
import ProjectSection from "./OrgProjectSection"

const UserPage = (props) => {
  return (
    <>
      <div className={layoutStyles.profileContainer}>
        <ProfileContainer username={props.data.username} bio={""} />
      </div>
      <div className={layoutStyles.projectSection}>
        <ProjectSection projects={props.data.namespace.projects} />
      </div>
    </>
  )
}

export default UserPage
