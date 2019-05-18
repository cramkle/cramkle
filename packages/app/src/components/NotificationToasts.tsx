import { useLingui } from '@lingui/react'
import { Snackbar } from '@material/react-snackbar'
import React, { useState, useEffect, useCallback } from 'react'

import { notificationState } from '../notification/index'
import { NotificationEvent } from '../notification/state'

const NotificationToasts: React.FunctionComponent = () => {
  const { i18n } = useLingui()

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
          notification: {
            onAction,
            timeoutMs,
            actionText,
            message,
            options = {},
          },
        } = event
        const {
          stacked = false,
          leading = true,
          closeOnEscape = false,
        } = options

        let translatedActionText = actionText && i18n._(actionText)

        return (
          <Snackbar
            key={id}
            leading={leading}
            stacked={stacked}
            closeOnEscape={closeOnEscape}
            message={i18n._(message)}
            actionText={translatedActionText}
            timeoutMs={timeoutMs}
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
