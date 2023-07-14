import React from 'react'
import IssueListBody from './IssueListBody'
import { SearchFilters } from '@/types/types'
import { Issue } from './types'
import { UseSearchFiltersHook } from '@/hooks/useSearchFilters'
import { IssueListContext } from './IssueListContext'
import IssueListHeader from './IssueListHeader'

type IssueListProps = {
  issues: Issue[]
  useSearchFiltersHook: UseSearchFiltersHook<SearchFilters>
  loading: boolean
  showFullPath?: boolean
}

export function IssueList2({
  issues,
  useSearchFiltersHook,
  loading,
  showFullPath = false,
}: IssueListProps) {
  const contextValue = React.useMemo(
    () => ({
      searchFilters: useSearchFiltersHook.searchFilters,
      setSearchParam: useSearchFiltersHook.setSearchParam,
    }),
    [useSearchFiltersHook.searchFilters, useSearchFiltersHook.setSearchParam]
  )

  return (
    <div className="border border-gray-300 rounded-md">
      <IssueListContext.Provider value={contextValue}>
        <IssueListHeader />
        <IssueListBody
          issues={issues ?? []}
          loading={loading}
          showFullPath={showFullPath}
        />
      </IssueListContext.Provider>
    </div>
  )
}
