import Head from "next/head"

import ProfileContainer from "@/components/user-profile/ProfileContainer"
import ProjectSection from "@/components/OrgProjectSection"

const UserPage = ({ props }) => {
  const projects = props.data.members
    .filter((e) => e.organization === null)
    .map((e) => e.project)

  console.log("PROJECT ", projects)

  const organizations = props.data.members
    .filter((e) => e.project === null)
    .map((e) => e.organization)
  return (
    <>
      <Head>
        <title>{props.data.username}'s Profile</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-start">
          <div className="w-1/4">
            <ProfileContainer
              data={props.data}
              username={props.data.username}
              bio={""}
            />
          </div>
          <div className="w-3/4 pl-8">
            <div className="flex flex-col h-full">
              <ProjectSection projects={projects} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserPage
