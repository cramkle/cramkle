import { WarningIcon } from '../components/icons/WarningIcon'
import type { ToastProps } from '../components/views/Toast'
import { Toast } from '../components/views/Toast'
import { ToastStore } from './store'

export const TIMEOUT_LONG = 5000
export const TIMEOUT_MEDIUM = 2000
export const TIMEOUT_SHORT = 1000

export const pushToast = (
  toastProps: ToastProps,
  timeoutMs?: number,
  store = ToastStore.getInstance()
) => {
  const id = store.add({
    toast: (
      <Toast
        {...toastProps}
        onDismiss={() => {
          store.expire(id)
        }}
      />
    ),
    timeoutMs,
  })

  return id
}

export const pushSimpleToast = (
  message: string,
  timeoutMs = TIMEOUT_MEDIUM
) => {
  return pushToast({ message }, timeoutMs)
}

export const pushErrorToast = (
  toastProps: Exclude<ToastProps, 'icon'>,
  timeoutMs?: number,
  store = ToastStore.getInstance()
) => {
  return pushToast(
    {
      ...toastProps,
      icon: <WarningIcon className="text-yellow-1" />,
    },
    timeoutMs,
    store
  )
}
