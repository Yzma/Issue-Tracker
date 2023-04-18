import Head from "next/head"

import ProfileContainer from "@/components/user-profile/ProfileContainer"
import ProjectList from "@/components/projects/ProjectList"

import { UserProfileProps } from "@/types/types"

const UserPage = ({ data }: { data: UserProfileProps }) => {

  console.log("Props: ", data)

  const profileInformation = {
    name: data.user.username,
    username: data.user.username,
    profilePictureURL: "",
    bio: data.user.bio,
    socialLinks: [data.user.socialLink1, data.user.socialLink2, data.user.socialLink3, data.user.socialLink4],
    organizations: data.organizations.map(org => {
      return {
        name: org.name
      }
    })
  }

  return (
    <>
      <Head>
        <title>{data.user.username}'s Profile</title>
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

                <ProjectList projects={data.namespace.projects.map(e => {
                  return {
                    id: e.id,
                    namespace: data.user.username,
                    name: e.name,
                    description: e.description,
                    private: e.private,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt
                  }
                })} />
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
