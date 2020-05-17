import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { PageArgs } from '../components/Pagination'

const usePaginationParams = () => {
  const location = useLocation()
  const paginationState = useMemo<PageArgs>(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.has('after') || searchParams.has('first')) {
      return {
        after: searchParams.get('after') || null,
        first: parseInt(searchParams.get('first'), 10),
      }
    }

    if (searchParams.has('before') || searchParams.has('last')) {
      return {
        before: searchParams.get('before') || null,
        last: parseInt(searchParams.get('last'), 10),
      }
    }

    return {
      after: null,
      first: 10,
    }
  }, [location.search])

  const history = useHistory()

  const updateStateAndSyncHistory = useCallback(
    (nextState: PageArgs) => {
      const searchParams = new URLSearchParams(location.search)

      ;['after', 'before', 'last', 'first'].forEach((key) => {
        searchParams.delete(key)
      })

      Object.entries(nextState).forEach(([key, value]) => {
        if (value == null) {
          return
        }

        searchParams.set(key, value.toString())
      })

      history.push(location.pathname + '?' + searchParams.toString())
    },
    [history, location.search, location.pathname]
  )

  const setPaginationParams = useCallback(
    (pageArgs: PageArgs) => {
      updateStateAndSyncHistory(pageArgs)
    },
    [updateStateAndSyncHistory]
  )

  const pageQuantity =
    'first' in paginationState ? paginationState.first : paginationState.last

  const onPageQuantityChange = useCallback(
    (value: number) => {
      updateStateAndSyncHistory({ after: null, first: value })
    },
    [updateStateAndSyncHistory]
  )

  return {
    paginationParams: paginationState,
    setPaginationParams,
    pageQuantity,
    onPageQuantityChange,
  }
}

export default usePaginationParams
