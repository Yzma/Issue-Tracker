import Head from "next/head"

import ProfileContainer from "@/components/user-profile/ProfileContainer"
import ProjectList from "@/components/projects/ProjectList"

import { ProfileInformation } from "../user-profile/types"

const UserPage = ({ props }) => {
  const projects = props.data.members
    .filter((e) => e.organization === null)
    .map((e) => {
      return { 
        ...e.project,
        namespace: e.project.namespace.name
      }
    })

    console.log("Props: ", props)
  console.log("PROJECT ", projects)

  const profileInformation: ProfileInformation = {
    name: props.data.username,
    username: props.data.username,
    profilePictureURL: "",
    bio: props.data.bio,
    socialLinks: [],
    organizations: []
  }

  return (
    <>
      <Head>
        <title>{props.data.username}'s Profile</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-start">
          <div className="w-1/4">
            <ProfileContainer
              data={profileInformation}
            />
          </div>
          <div className="w-3/4 pl-8">
            <div className="flex flex-col h-full">
              <div className="w-full max-w-5xl mt-4 flex-1">
                <ProjectList projects={projects} />
                {/* <ProjectSection projects={projects} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserPage
