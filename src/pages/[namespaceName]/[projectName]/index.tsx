import { useState } from 'react'
import { useRouter } from 'next/router'

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Issue, Label, Namespace, Project } from '@prisma/client'
import Header from '@/components/Header'
import IssueList from '@/components/IssueList'
import IssueButtons from '@/components/IssueButtons'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'

import { getServerSideSession } from '@/lib/sessions'
import prisma from '@/lib/prisma/prisma'

export default function Issues({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(data)

  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [filteredIssues, setFilteredIssues] = useState(data)

  const handleSearch = (searchTerm: string) => {
    const filtered = data.filter((issue) =>
      issue.labels.some((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredIssues(filtered)
  }

  return (
    <main>
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <ProjectBelowNavbar
            namespaceName={namespaceName}
            projectName={projectName}
            selected="issues"
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
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  data: (Issue & { labels: Label[] })[]
}> = async (context) => {
  const { namespaceName, projectName } = context.query

  const session = await getServerSideSession(context)

  const project = (await prisma.project.findFirst({
    where: {
      // @ts-ignore
      name: projectName,
      namespace: {
        // @ts-ignore
        name: namespaceName,
      },
    },

    include: {
      namespace: true,
    },
  })) as Project & { namespace: Namespace }

  if (!project) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  console.log('Project: ', project)

  if (project.private) {
    if (!session) {
      console.log('private - session is null')
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }

    // Is the user apart of the project separately?
    let isMember = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        projectId: project.id,
      },
    })

    if (!isMember) {
      // If the project belongs to an organization, then check if they are apart of that organization
      if (project.namespace.organizationId) {
        const isOrganizationMember = await prisma.member.findFirst({
          where: {
            userId: session.user.id,
            organizationId: project.namespace.organizationId,
          },
        })

        console.log('isOrganizationMember ', isOrganizationMember)

        if (!isOrganizationMember) {
          console.log('private - is not organization member')
          return {
            redirect: {
              destination: '/404',
              permanent: false,
            },
          }
        }
        isMember = true
      }
    }

    if (!isMember) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }
  }

  const issuesData = await prisma.issue.findMany({
    where: {
      projectId: project.id,
    },
    include: {
      labels: true,
    },
  })

  console.log(issuesData)

  return {
    props: {
      data: issuesData,
    },
  }
}
