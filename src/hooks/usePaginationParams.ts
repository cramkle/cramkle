import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import type { PageArgs } from '../components/Pagination'

type PaginationState = PageArgs

export const usePaginationParams = () => {
  const router = useRouter()
  const search = useSearchParams()
  const pathname = usePathname()

  const queryParams = useMemo(
    () => new URLSearchParams(search ?? undefined),
    [search]
  )

  const paginationParams = useMemo<PaginationState>(() => {
    let page = 1
    let size = 10

    const queryPage = queryParams.get('page')

    if (queryPage) {
      page = parseInt(queryPage, 10)
    }

    const querySize = queryParams.get('size')

    if (querySize) {
      size = parseInt(querySize, 10)
    }

    return {
      page,
      size,
    }
  }, [queryParams])

  const updatePaginationParams = useCallback(
    (newParams: Partial<PaginationState>) => {
      const updatedParams = { ...paginationParams, ...newParams }

      const updatedQueryParams = new URLSearchParams(queryParams)

      updatedQueryParams.set('page', updatedParams.page.toString())
      updatedQueryParams.set('size', updatedParams.size.toString())

      router.push(pathname + '?' + updatedQueryParams.toString())
    },
    [queryParams, paginationParams, router, pathname]
  )

  return {
    paginationParams,
    pageSize: paginationParams.size,
    onPaginationChange: updatePaginationParams,
  }
}
