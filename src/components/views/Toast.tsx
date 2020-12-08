import classnames from 'classnames'
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as React from 'react'

import { useFadeEffect } from '../../hooks/useFadeEffect'
import ToastStore, { ToastState } from '../../toasts/store'
import { useTheme } from '../Theme'
import ClearIcon from '../icons/ClearIcon'
import Button from './Button'
import IconButton from './IconButton'
import styles from './Toast.css'

const toastStore = ToastStore.getInstance()

interface ToastAction {
  onPress: (evt: React.MouseEvent) => void
  label: string
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: ReactNode
  icon?: ReactNode
  onDismiss?: () => void
  action?: ToastAction
}

export const Toast: React.VFC<ToastProps> = ({
  action,
  message,
  onDismiss,
  icon,
  ...props
}) => {
  const { theme } = useTheme()

  return (
    <div
      className={classnames({
        '__dark-mode': theme === 'light',
        '__light-mode': theme === 'dark',
      })}
    >
      <div
        {...props}
        className={classnames(
          props.className,
          styles.toast,
          'h-16 bg-surface inline-flex items-center rounded p-4 shadow max-w-100'
        )}
      >
        {icon && <div className="w-6 h-6 mr-4">{icon}</div>}
        <div
          className="text-primary mr-auto text-sm sm:text-base"
          role="alert"
          aria-atomic
        >
          {message}
        </div>
        {action != null && (
          <div className="ml-4">
            <Button
              size="small"
              onClick={(evt) => {
                onDismiss?.()
                action.onPress(evt)
              }}
            >
              {action.label}
            </Button>
          </div>
        )}
        <div className="flex items-center ml-4">
          <IconButton className="h-6 w-6 p-0" onClick={onDismiss}>
            <ClearIcon className="text-primary" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

interface ToastAnimationProps {
  children: ReactElement
  position: number
  expired: boolean
  id: string
}

const TOAST_ELEMENT_OFFSET = 64 + 8

export const ToastAnimation: React.VFC<ToastAnimationProps> = ({
  children,
  position,
  id,
  expired,
}) => {
  const child = React.Children.only(children)

  const handleMouseEnter = useCallback(() => {
    toastStore.pauseTimer(id)
  }, [id])

  const handleMouseLeave = useCallback(() => {
    toastStore.resetTimer(id)
  }, [id])

  const [shouldShow, shouldBeVisible, ref] = useFadeEffect(!expired)

  useEffect(() => {
    if (!shouldShow) {
      toastStore.hidden(id)
    }
  }, [id, shouldShow])

  return shouldShow ? (
    <li
      ref={ref}
      className={classnames(
        styles.appearBottom,
        'inline-block absolute transition-all duration-200 ease-in-out opacity-0',
        { 'opacity-100': shouldBeVisible }
      )}
      style={{ bottom: TOAST_ELEMENT_OFFSET * position }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {child}
    </li>
  ) : null
}

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
