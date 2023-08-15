import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { IssueList2 } from '@/components/issue-list/IssueList'
import { SearchFilters } from '@/types/types'
import { useSearchFilters } from '@/hooks/useSearchFilters'
import { trpc } from '@/lib/trpc/trpc'
import { Input } from '@/components/ui/input'
import { Issue } from '@/components/issue-list/types'
import { getProjectServerSideProps } from '@/lib/layout/projects'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'

export default function Issues({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchFilters = useSearchFilters<SearchFilters>({
    open: true,
    sort: 'newest',
  })

  const globalIssuesQuery = trpc.issues.getAllIssues.useQuery(
    {
      name: projectName,
      owner: namespaceName,
      open: searchFilters.searchFilters.open,
      sort: searchFilters.searchFilters.sort,
      limit: 15,
    },

    {
      retry: false,
    }
  )

  return (
    <>
      <Head>
        <title>{projectName}</title>
      </Head>
      <div className="container mx-auto px-4 max-w-3/4">
        <div className="flex justify-between w-full items-center my-4">
          <div className="flex w-5/6 items-center space-x-2">
            <Input type="search" placeholder="Search for an issue" />
            <Button type="button">Search</Button>
          </div>
          <Button asChild>
            <Link href={`/${namespaceName}/${projectName}/new`}>
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              <span>New Issue</span>
            </Link>
          </Button>
        </div>
        <div>
          <IssueList2
            issues={globalIssuesQuery.data as Issue[]}
            useSearchFiltersHook={searchFilters}
            loading={globalIssuesQuery.isLoading}
          />
        </div>
      </div>
    </>
  )
}

Issues.getLayout = function getLayout(
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
