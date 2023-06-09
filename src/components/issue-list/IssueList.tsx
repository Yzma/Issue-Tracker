import { createContext } from 'react'
import IssueListBody from './IssueListBody'
import IssueListHeader from './IssueListHeader'
import { SearchFilters } from '@/types/types'
import { Issue } from './types'
import { UseSearchFiltersHook } from '@/hooks/useSearchFilters'

type ContextType<T extends SearchFilters> = {
  searchFilters: SearchFilters
  setSearchParam: <K extends keyof T>(param: K, value: T[K]) => void
}

export const IssueListContext = createContext<ContextType<SearchFilters>>({
  searchFilters: {
    open: true,
    sort: 'newest',
  },
  setSearchParam: () => { },
})

type IssueListProps = {
  issues: Issue[]
  useSearchFiltersHook: UseSearchFiltersHook<SearchFilters>
}

export function IssueList2({ issues, useSearchFiltersHook }: IssueListProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3/4">
      <div className="bg-white shadow-md rounded-md">
        <IssueListContext.Provider
          value={{
            searchFilters: useSearchFiltersHook.searchFilters,
            setSearchParam: useSearchFiltersHook.setSearchParam,
          }}
        >
          <IssueListHeader />
          <IssueListBody issues={issues ?? []} />
        </IssueListContext.Provider>
      </div>
    </div>
  )
}
