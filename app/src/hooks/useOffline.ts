import { useCallback, useEffect, useState } from 'react'

const useOffline = () => {
  const [offline, setOffline] = useState(
    typeof navigator === 'undefined' ? false : !navigator.onLine
  )

  const handleNetworkStatusChange = useCallback(() => {
    setOffline(!navigator.onLine)
  }, [])

  useEffect(() => {
    window.addEventListener('online', handleNetworkStatusChange)
    window.addEventListener('offline', handleNetworkStatusChange)

    return () => {
      window.removeEventListener('online', handleNetworkStatusChange)
      window.removeEventListener('offline', handleNetworkStatusChange)
    }
  }, [handleNetworkStatusChange])

  return offline
}

export default useOffline
