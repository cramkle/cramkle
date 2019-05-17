import Emitter from './event'

interface NotificationAction {
  actionText: string
  onAction: (event?: any) => void
}

interface NotificationMessage {
  message: string
  action?: NotificationAction
  timeoutMs?: number
  leading?: boolean
  stacked?: boolean
}

export default class NotificationState {
  private notificationEmitter = new Emitter<NotificationMessage>()

  public onNotification = this.notificationEmitter.event

  public addNotification(notification: NotificationMessage) {
    this.notificationEmitter.emit(notification)
  }
}
