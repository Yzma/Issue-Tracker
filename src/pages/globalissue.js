import Head from "next/head"
import Header from "@/components/Header"
import IssueList from "@/components/IssueList"
import IssueButtons from "@/components/IssueButtons"
import SearchBar from "@/components/IssueSearchBar"
import { useState } from "react"
import prisma from "@/lib/prisma/prisma"
import { useRouter } from "next/router"
import { getSession } from "next-auth/react"
import Link from "next/link"
import BelowNavbar from "@/components/other/BelowNavbar"

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
            <div>
              <IssueList
                issues={filteredIssues}
                routePath={`/${namespaceName}/${projectName}`}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const issuesData = await prisma.issue.findMany({
    where: {
      userId: session.user.id
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
