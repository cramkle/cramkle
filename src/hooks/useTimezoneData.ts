import { useEffect, useReducer } from 'react'

export interface TimezoneEntry {
  name: string
  timezoneOffset: number
}

const loadTimezoneData = (() => {
  let timezones: null | TimezoneEntry[] = null
  let promise: Promise<TimezoneEntry[]> | null = null

  return () => {
    if (timezones != null) {
      return timezones
    }

    if (promise == null) {
      promise = import('../data/tzinfo.json').then(({ default: data }) => {
        timezones = data
        promise = null

        return timezones
      })
    }

    return promise
  }
})()

type State =
  | { loading: true; timezones: undefined }
  | { loading: false; timezones: TimezoneEntry[] }

type Action = { type: 'LOADED'; data: TimezoneEntry[] }

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'LOADED': {
      return {
        loading: false,
        timezones: action.data,
      }
    }
    default: {
      return state
    }
  }
}

const init = (_: unknown) => {
  const maybeTimezones = loadTimezoneData()

  if ('then' in maybeTimezones) {
    return {
      loading: true,
      timezones: undefined,
    } as State
  }

  return { loading: false, timezones: maybeTimezones } as State
}

export const useTimezoneData = () => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>, undefined>(
    reducer,
    undefined,
    init
  )

  useEffect(() => {
    const maybeTimezones = loadTimezoneData()

    if ('then' in maybeTimezones) {
      maybeTimezones.then((data) => {
        dispatch({ type: 'LOADED', data })
      })
    }
  }, [])

  return state
}
