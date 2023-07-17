import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Header from '@/components/Header'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'

import { Button } from '@/components/ui/button'
import { IssueList2 } from '@/components/issue-list/IssueList'
import { SearchFilters } from '@/types/types'
import { useSearchFilters } from '@/hooks/useSearchFilters'
import { trpc } from '@/lib/trpc/trpc'
import { Input } from '@/components/ui/input'
import { Issue } from '@/components/issue-list/types'

export default function Issues() {
  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const searchFilters = useSearchFilters<SearchFilters>({
    open: true,
    sort: 'newest',
  })

  const globalIssuesQuery = trpc.issues.getAllIssues.useQuery(
    {
      name: projectName as string,
      owner: namespaceName as string,
      open: searchFilters.searchFilters.open,
      sort: searchFilters.searchFilters.sort,
      limit: 15,
    },

    {
      retry: false,
    }
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <ProjectBelowNavbar
          namespaceName={namespaceName}
          projectName={projectName}
          selected="issues"
        />
        <div className="container mx-auto px-4 py-8 max-w-3/4">
          <div className="flex justify-between w-full items-center my-4">
            <div className="flex w-5/6 items-center space-x-2">
              <Input type="search" placeholder="Search for an issue" />
              <Button type="button">Search</Button>
            </div>
            <Button asChild>
              <Link
                href={`/${namespaceName as string}/${
                  projectName as string
                }/new`}
              >
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
      </div>
    </div>
  )
}
