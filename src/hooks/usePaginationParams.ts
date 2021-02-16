import type { Location } from 'history'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { PageArgs } from '../components/Pagination'

type PaginationState = PageArgs

const usePaginationParams = () => {
  const navigate = useNavigate()
  const location = useLocation() as Location<PaginationState>

  const queryParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])

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

      navigate(location.pathname + '?' + updatedQueryParams.toString())
    },
    [queryParams, paginationParams, navigate, location.pathname]
  )

  return {
    paginationParams,
    pageSize: paginationParams.size,
    onPaginationChange: updatePaginationParams,
  }
}

export default usePaginationParams
