import { createContext } from 'react'
import { SearchFilters } from '@/types/types'

type ContextType<T extends SearchFilters> = {
  searchFilters: SearchFilters
  setSearchParam: <K extends keyof T>(param: K, value: T[K]) => void
}

export const IssueListContext = createContext<ContextType<SearchFilters>>({
  searchFilters: {
    open: true,
    sort: 'newest',
  },
  setSearchParam: () => {},
})
