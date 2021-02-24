import { useEffect, useRef } from 'react'

export function useLatestRefEffect<T>(value: T, callback: (value: T) => void) {
  const latestRef = useRef(value)

  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (latestRef.current === value) {
      return
    }

    latestRef.current = value

    callbackRef.current(value)
  }, [value])
}
