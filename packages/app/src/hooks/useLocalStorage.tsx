import { useEffect, useState } from 'react'

const useLocalStorage = <T extends {}>(
  key: string,
  value: T,
  forceInitial: boolean = false
): [T, ((updater: T | ((prevValue: T) => T)) => void)] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)

      return item && !forceInitial ? (JSON.parse(item) as T) : value
    } catch {
      return value
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (e) {
      console.error(e)
    }
  }, [storedValue, key])

  return [storedValue, setStoredValue]
}

export default useLocalStorage
