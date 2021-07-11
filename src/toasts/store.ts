import type { ReactElement } from 'react'
import * as uuid from 'uuid'

export interface ToastState {
  config: ToastConfig
  timeoutId?: NodeJS.Timeout
  shown: boolean
  expired: boolean
  id: string
}

export type ToastConfig = {
  toast: ReactElement
  timeoutMs?: number
}

interface Listener {
  handler: (toasts: Record<string, ToastState>) => void
}

export class ToastStore {
  private toasts = new Map<string, ToastState>()

  private listeners: Set<Listener> = new Set()

  public registerView = (
    handler: (toasts: Record<string, ToastState>) => void
  ) => {
    const listener = { handler }

    this.listeners.add(listener)

    this.emit()

    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit = () => {
    this.listeners.forEach(({ handler }) => {
      handler(Object.fromEntries(this.toasts))
    })
  }

  private emitAfterReturn =
    <T, V>(fn: (...args: T[]) => V) =>
    (...args: T[]) => {
      const returnValue = fn(...args)

      this.emit()

      return returnValue
    }

  public add = this.emitAfterReturn((toastConfig: ToastConfig) => {
    const id = uuid.v4()

    let timeoutId = undefined

    if (toastConfig.timeoutMs != null) {
      timeoutId = setTimeout(() => {
        this.expire(id)
      }, toastConfig.timeoutMs)
    }

    const toast = {
      config: toastConfig,
      timeoutId,
      expired: false,
      shown: false,
      id,
    }

    this.toasts = new Map(Array.from(this.toasts).concat([[id, toast]]))

    return id
  })

  public remove = this.emitAfterReturn((id: string) => {
    if (this.toasts.has(id)) {
      this.toasts = new Map(this.toasts)
      this.toasts.delete(id)
    }
  })

  public pauseTimer = this.emitAfterReturn((id: string) => {
    if (!this.toasts.has(id)) {
      return
    }

    const toast = this.toasts.get(id)!

    if (toast.timeoutId == null) {
      return
    }

    clearTimeout(toast.timeoutId)

    this.toasts = new Map(
      Array.from(this.toasts).concat([[id, { ...toast, timeoutId: undefined }]])
    )
  })

  public resetTimer = this.emitAfterReturn((id: string) => {
    if (!this.toasts.has(id)) {
      return
    }

    this.pauseTimer(id)

    const toast = this.toasts.get(id)!

    if (toast.config.timeoutMs == null) {
      return
    }

    const timeoutId = setTimeout(() => {
      this.expire(id)
    }, toast.config.timeoutMs)

    this.toasts = new Map(
      Array.from(this.toasts).concat([[id, { ...toast, timeoutId }]])
    )
  })

  public shown = this.emitAfterReturn((id: string) => {
    if (!this.toasts.has(id)) {
      return
    }

    const toast = this.toasts.get(id)!

    if (toast.shown) {
      return
    }

    this.toasts = new Map(
      Array.from(this.toasts).concat([[id, { ...toast, shown: true }]])
    )
  })

  public hidden = this.emitAfterReturn((id: string) => {
    if (!this.toasts.has(id)) {
      return
    }

    const toast = this.toasts.get(id)!

    if (toast.shown || toast.expired) {
      this.pauseTimer(id)
      this.toasts = new Map(this.toasts)
      this.toasts.delete(id)
    }
  })

  public expire = this.emitAfterReturn((id: string) => {
    if (!this.toasts.has(id)) {
      return
    }

    const toast = this.toasts.get(id)!

    this.toasts.set(id, { ...toast, expired: true })

    this.pauseTimer(id)
  })

  private static instance: ToastStore | null = null

  public static getInstance = () => {
    if (!ToastStore.instance) {
      ToastStore.instance = new ToastStore()
    }

    return ToastStore.instance
  }
}
