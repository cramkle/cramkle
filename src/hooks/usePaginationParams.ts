import { Location } from 'history'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PageArgs } from '../components/Pagination'

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

    if (queryParams.get('page')) {
      page = parseInt(queryParams.get('page'), 10)
    }

    if (queryParams.get('size')) {
      size = parseInt(queryParams.get('size'), 10)
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
