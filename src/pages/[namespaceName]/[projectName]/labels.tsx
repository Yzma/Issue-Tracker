import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Header from '@/components/Header'
import LabelList from '@/components/LabelList'
import LabelSearchBar from '@/components/LabelSearchBar'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'

import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'

// TODO: Create one type and emit it from /new page
type LabelProps = {
  id: string
  name: string
  description: string
  color: string
}

export default function ProjectLabels({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (search: string) => {
    setSearchTerm(search)
  }

  // const filteredLabels = data.filter((label) =>
  //   label.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  return (
    <>
      <Head>
        <title>{projectName} Labels</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <header className="px-5 py-4">
          <h2 className="font-bold text-slate-800">Labels</h2>
        </header>
        <div>
          <LabelSearchBar onSearch={handleSearch} />

          {/* <LabelList labels={filteredLabels} /> */}
        </div>
      </div>
    </>
  )
}

ProjectLabels.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getProjectLayout({
    page,
    namespaceName: page.props.namespaceName,
    projectName: page.props.projectName,
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getProjectServerSideProps(context)
}
