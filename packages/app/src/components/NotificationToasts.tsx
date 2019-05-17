import { Snackbar } from '@material/react-snackbar'
import React, { useState, useEffect, useCallback } from 'react'

import { notificationState } from '../notification/index'
import { NotificationEvent } from '../notification/state'

const NotificationToasts: React.FunctionComponent = () => {
  const [notificationEvents, setNotifications] = useState<NotificationEvent[]>(
    []
  )

  const handleNotificationRemove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(event => event.id !== id))
  }, [])

  useEffect(
    () =>
      notificationState.onNotification(event => {
        setNotifications(prev => [...prev, event])
      }),
    []
  )

  useEffect(
    () =>
      notificationState.onNotificationRemoved(({ id }) => {
        handleNotificationRemove(id)
      }),
    [handleNotificationRemove]
  )

  return (
    <>
      {notificationEvents.map(event => {
        const {
          id,
          notification: { onAction, ...notification },
        } = event

        return (
          <Snackbar
            key={id}
            {...notification}
            leading
            onClose={() => {
              handleNotificationRemove(id)
              onAction && onAction()
            }}
          />
        )
      })}
    </>
  )
}

export default NotificationToasts
