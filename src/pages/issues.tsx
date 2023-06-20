import Header from '@/components/Header'
import { IssueList2 } from '@/components/issue-list/IssueList'
import { Issue } from '@/components/issue-list/types'
import { useSearchFilters } from '@/hooks/useSearchFilters'

import { trpc } from '@/lib/trpc/trpc'
import { SearchFilters } from '@/types/types'

export default function Issues() {
  const searchFilters = useSearchFilters<SearchFilters>({
    open: true,
    sort: 'newest',
  })
  const globalIssuesQuery = trpc.users.getGlobalIssues.useQuery(
    searchFilters.searchFilters
  )

  // if (globalIssuesQuery.isLoading) return

  // if (globalIssuesQuery.error) return <div>{globalIssuesQuery.error.message}</div>

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <div>
          <IssueList2
            issues={globalIssuesQuery.data as Issue[]}
            useSearchFiltersHook={searchFilters}
          />
        </div>
      </div>
    </div>
  )
}
