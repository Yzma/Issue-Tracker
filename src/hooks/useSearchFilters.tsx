import { useState } from 'react'
import { SearchFilters } from '@/types/types'

export type UseSearchFiltersHook<T extends SearchFilters> = {
  searchFilters: T
  setSearchFilter: (filter: Partial<T>) => void
  setSearchParam: <K extends keyof T>(param: K, value: T[K]) => void
  getSearchParam: <K extends keyof T>(param: K) => T[K]
}

export function useSearchFilters<T extends SearchFilters>(
  initialFilters: T
): UseSearchFiltersHook<T> {
  const [searchFilters, setSearchFilters] = useState<T>(initialFilters)

  const setSearchFilter = (filter: Partial<T>) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      ...filter,
    }))
  }

  const setSearchParam = <K extends keyof T>(param: K, value: T[K]) => {
    setSearchFilter({ [param]: value } as unknown as Partial<T>)
  }

  const getSearchParam = <K extends keyof T>(param: K) => {
    return searchFilters[param]
  }

  return { searchFilters, setSearchFilter, setSearchParam, getSearchParam }
}
