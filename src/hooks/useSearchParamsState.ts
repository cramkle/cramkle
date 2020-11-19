import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useSearchParamsState = (key: string, defaultValue: string = null) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [value, setValue] = useState(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.has(key)) {
      return searchParams.get(key)
    }

    return defaultValue
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.has(key)) {
      if (searchParams.get(key) === value) {
        return
      }

      setValue(searchParams.get(key))
      return
    }
  }, [location, key, value])

  const updateValue = useCallback(
    (newValue: string) => {
      const searchParams = new URLSearchParams(location.search)

      searchParams.set(key, newValue)

      navigate(location.pathname + '?' + searchParams.toString())
    },
    [navigate, key, location.pathname, location.search]
  )

  return [value, updateValue] as const
}

export default useSearchParamsState
