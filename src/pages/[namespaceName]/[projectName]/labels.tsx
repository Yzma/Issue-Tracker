import Head from 'next/head'

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'

export default function ProjectLabels({
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          {/* <LabelSearchBar onSearch={handleSearch} /> */}

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
