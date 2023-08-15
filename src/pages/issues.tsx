import { IssueList2 } from '@/components/issue-list/IssueList'
import { Issue } from '@/components/issue-list/types'
import { getLayout } from '@/components/layout/DefaultLayout'
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

  return (
    <IssueList2
      issues={globalIssuesQuery.data as Issue[]}
      useSearchFiltersHook={searchFilters}
      loading={globalIssuesQuery.isLoading}
      showFullPath
    />
  )
}

Issues.getLayout = getLayout
