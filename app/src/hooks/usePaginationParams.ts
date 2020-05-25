import { useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { PageArgs } from '../components/Pagination'
import useLatestRefEffect from './useLatestRefEffect'

type PaginationState = PageArgs

const usePaginationParams = () => {
  const history = useHistory()
  const location = useLocation<PaginationState>()

  const queryParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])

  const [paginationParams, setPaginationParams] = useState<PaginationState>(
    () => {
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
    }
  )

  useLatestRefEffect(paginationParams, (latestParams) => {
    const updatedQueryParams = new URLSearchParams(queryParams)

    updatedQueryParams.set('page', latestParams.page.toString())
    updatedQueryParams.set('size', latestParams.size.toString())

    history.push(location.pathname + '?' + updatedQueryParams.toString())
  })

  const updatePaginationParams = useCallback(
    (newParams: Partial<PaginationState>) => {
      setPaginationParams((prevParams) => ({ ...prevParams, ...newParams }))
    },
    []
  )

  return {
    paginationParams,
    pageSize: paginationParams.size,
    onPaginationChange: updatePaginationParams,
  }
}

export default usePaginationParams
