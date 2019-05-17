import { MessageDescriptor } from '@lingui/core'
import * as uuid from 'uuid'

import Emitter from './event'

export interface NotificationMessage {
  message: MessageDescriptor
  timeoutMs?: number
  actionText?: MessageDescriptor
  onAction?: () => void
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
