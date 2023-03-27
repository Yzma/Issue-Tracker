import Head from "next/head"
import { useRouter } from "next/router"
import layoutStyles from "@/styles/usersLayout.module.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LabelList from "@/components/LabelList"
import LabelSearchBar from "@/components/LabelSearchBar"
import { useState } from "react"

import prisma from "@/lib/prisma/prisma"
import ProjectBelowNavbar from "@/components/navbar/ProjectBelowNavbar"

export default function LabelPage(props) {
  const router = useRouter()
  const { namespaceName, projectName } = router.query
  console.log(props)

  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm)
  }

  const filteredLabels = props.labelData.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Label Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main>
            <Header />
            <ProjectBelowNavbar
              namespaceName={namespaceName}
              projectName={projectName}
              selected={"labels"}
            />
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <header className="px-5 py-4">
                <h2 className="font-bold text-slate-800">Labels</h2>
              </header>
              <div>
                <LabelSearchBar onSearch={handleSearch} />

                <LabelList labels={filteredLabels} />
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName } = context.query
  const labelData = await prisma.label.findMany({
    where: {
      project: {
        name: projectName,
        namespace: {
          name: namespaceName
        }
      }
    }
  })

  console.log(labelData)

  return {
    props: { labelData }
  }
}
