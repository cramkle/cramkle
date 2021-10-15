import type { ReactElement } from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { ToastState } from '../../toasts/store'
import { ToastStore } from '../../toasts/store'

const toastStore = ToastStore.getInstance()

interface ToasterProps {
  className?: string
  children: (
    toast: ReactElement,
    id: string,
    position: number,
    expired: boolean
  ) => void
}

export const Toaster: React.VFC<ToasterProps> = ({ className, children }) => {
  const [toastState, setToasts] = useState<Record<string, ToastState>>({})

  useEffect(() => {
    const unregister = toastStore.registerView(setToasts)

    return () => {
      unregister()
    }
  }, [])

  const toasts = useMemo(() => Object.values(toastState), [toastState])

  return (
    <ul className={className}>
      {toasts.reverse().map((toastState, index) => {
        const {
          id,
          config: { toast },
          expired,
        } = toastState

        return children(toast, id, index, expired)
      })}
    </ul>
  )
}
