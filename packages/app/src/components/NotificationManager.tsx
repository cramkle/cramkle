import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react'

const NotificationContext = createContext(null)

interface Notification {
  label: string
  action: (event?: any) => void
}

type SubscriptionCallback = (notification: Notification) => void

const NotificationManager = ({ children }) => {
  const listenersRef = useRef(new Set<SubscriptionCallback>())

  const subscribe = useCallback((callback: SubscriptionCallback) => {
    listenersRef.current.add(callback)

    return () => {
      listenersRef.current.delete(callback)
    }
  }, [])

  const push = useCallback((notification: Notification) => {
    listenersRef.current.forEach(callback => callback(notification))
  }, [])

  const context = useMemo(
    () => ({
      subscribe,
      push,
    }),
    [subscribe, push]
  )

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}

export default NotificationManager
