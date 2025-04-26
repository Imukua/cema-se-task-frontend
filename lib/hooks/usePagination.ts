"use client"

import { useState, useCallback } from "react"
import type { PaginatedResponse } from "../types/api"

interface UsePaginationProps<T> {
  initialPage?: number
  initialLimit?: number
  fetchFunction: (page: number, limit: number, ...args: any[]) => Promise<PaginatedResponse<T>>
}

interface UsePaginationReturn<T> {
  data: T[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
  isLoading: boolean
  error: Error | null
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  prevPage: () => Promise<void>
  setPageSize: (size: number) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook for handling paginated API requests
 */
export function usePagination<T>({
  initialPage = 1,
  initialLimit = 10,
  fetchFunction,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [fetchArgs, setFetchArgs] = useState<any[]>([])

  /**
   * Fetch data for the current page
   */
  const fetchData = useCallback(
    async (pageToFetch: number, limitToFetch: number, ...args: any[]) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchFunction(pageToFetch, limitToFetch, ...args)

        setData(response.results)
        setTotalPages(response.totalPages)
        setTotalResults(response.totalResults)
        setHasNextPage(response.hasNextPage)

        // Store the args for refresh
        setFetchArgs(args)

        return response
      } catch (err) {
        setError(err as Error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchFunction],
  )

  /**
   * Go to a specific page
   */
  const goToPage = useCallback(
    async (pageNumber: number) => {
      if (pageNumber < 1 || (totalPages > 0 && pageNumber > totalPages)) {
        return
      }

      await fetchData(pageNumber, limit, ...fetchArgs)
      setPage(pageNumber)
    },
    [fetchData, limit, totalPages, fetchArgs],
  )

  /**
   * Go to the next page
   */
  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await goToPage(page + 1)
    }
  }, [goToPage, page, hasNextPage])

  /**
   * Go to the previous page
   */
  const prevPage = useCallback(async () => {
    if (page > 1) {
      await goToPage(page - 1)
    }
  }, [goToPage, page])

  /**
   * Change the page size
   */
  const setPageSize = useCallback(
    async (size: number) => {
      if (size < 1) return

      await fetchData(1, size, ...fetchArgs)
      setLimit(size)
      setPage(1)
    },
    [fetchData, fetchArgs],
  )

  /**
   * Refresh the current page
   */
  const refresh = useCallback(async () => {
    await fetchData(page, limit, ...fetchArgs)
  }, [fetchData, page, limit, fetchArgs])

  return {
    data,
    page,
    limit,
    totalPages,
    totalResults,
    hasNextPage,
    isLoading,
    error,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    refresh,
  }
}
