import { MessageDescriptor } from '@lingui/core'
import * as uuid from 'uuid'

import { Props as SnackbarProps } from '../components/views/Snackbar'
import Emitter from './event'

export interface NotificationMessage {
  message: MessageDescriptor | string
  timeoutMs?: number
  actionText?: MessageDescriptor | string
  onAction?: () => void
  options?: Pick<SnackbarProps, 'closeOnEscape' | 'leading' | 'stacked'>
}

export interface NotificationEvent {
  id: string
  notification: NotificationMessage
}

export interface NotificationRemovedEvent {
  id: string
}

export default class NotificationState {
  private notificationEmitter = new Emitter<NotificationEvent>()
  private removedNotificationEmitter = new Emitter<NotificationRemovedEvent>()

  private notifications = new Map<string, NotificationMessage>()

  public onNotification = this.notificationEmitter.event
  public onNotificationRemoved = this.removedNotificationEmitter.event

  public addNotification(notification: NotificationMessage) {
    const id = uuid.v4()
    this.notifications.set(id, notification)

    this.notificationEmitter.emit({ id, notification })

    return id
  }

  public removeNotification(id: string) {
    if (this.notifications.has(id)) {
      this.notifications.delete(id)

      this.removedNotificationEmitter.emit({ id })
    }
  }
}
