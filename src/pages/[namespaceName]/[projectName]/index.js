import Head from "next/head"
import Header from "@/components/Header"
import IssueList from "@/components/IssueList"
import IssueButtons from "@/components/IssueButtons"
import { useState } from "react"
import prisma from "@/lib/prisma/prisma"
import { useRouter } from "next/router"
import { getServerSession } from "@/lib/sessions"
import ProjectBelowNavbar from "@/components/navbar/ProjectBelowNavbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

export default function Issues({ issuesData }) {
  console.log(issuesData)

  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [filteredIssues, setFilteredIssues] = useState(issuesData)

  const handleSearch = (searchTerm) => {
    const filtered = issuesData.filter((issue) =>
      issue.labels.some((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredIssues(filtered)
  }

  return (
    <>
      <Head></Head>
      <main>
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header />
            <ProjectBelowNavbar
              namespaceName={namespaceName}
              projectName={projectName}
              selected={"issues"}
            />
            <div className="container mx-auto px-4 py-8 max-w-3/4">
              <IssueButtons
                onSearch={handleSearch}
                path={`/${namespaceName}/${projectName}`}
              />
              <div className="bg-white shadow-md rounded-md">
                <IssueList
                  issues={filteredIssues}
                  routePath={`/${namespaceName}/${projectName}`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 flex justify-center items-center pb-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faBug} />
          <p className="mt-2">Bug-Zapper</p>
        </div>
      </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName } = context.query

  const session = await getServerSession(context.req, context.res)

  const project = await prisma.project.findFirst({
    where: {
      name: projectName,
      namespace: {
        name: namespaceName
      }
    },

    include: {
      namespace: true
    }
  })

  if(!project) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    }
  }

  console.log("Project: ", project)

  if (project.private) {
    if (!session) {
      console.log("private - session is null")
      return {
        redirect: {
          destination: "/404",
          permanent: false
        }
      }
    }

    // Is the user apart of the project separately?
    let isMember = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        projectId: project.id
      }
    })

    if(!isMember) {
      // If the project belongs to an organization, then check if they are apart of that organization
      if (project.namespace.organizationId) {
        const isOrganizationMember = await prisma.member.findFirst({
          where: {
            userId: session.user.id,
            organizationId: project.namespace.organizationId
          }
        })

        if (!isOrganizationMember) {
          console.log("private - is not organization member")
          return {
            redirect: {
              destination: "/404",
              permanent: false
            }
          }
        }
      }
    }

    if(!isMember) {
      return {
        redirect: {
          destination: "/404",
          permanent: false
        }
      }
    }
  }

  const issuesData = await prisma.issue.findMany({
    where: {
      projectId: project.id
    },
    include: {
      labels: true
    }
  })

  console.log(issuesData)

  return {
    props: {
      issuesData: issuesData.map((issue) => ({
        ...issue,
        createdAt: issue.createdAt.toISOString(),
        updatedAt: issue.updatedAt.toISOString()
      }))
    }
  }
}
