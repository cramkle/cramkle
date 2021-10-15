import classnames from 'classnames'
import type { ReactElement, ReactNode } from 'react'
import { useCallback, useEffect } from 'react'
import * as React from 'react'

import { useFadeEffect } from '../../hooks/useFadeEffect'
import { ToastStore } from '../../toasts/store'
import { useTheme } from '../Theme'
import { ClearIcon } from '../icons/ClearIcon'
import { Button } from './Button'
import { IconButton } from './IconButton'
import styles from './Toast.module.css'

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
        '__light-mode': theme === 'dark',
        '__dark-mode': theme === 'light',
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
          className="text-txt text-opacity-text-primary mr-auto text-sm sm:text-base"
          role="alert"
          aria-atomic
        >
          {message}
        </div>
        {action != null && (
          <div className="ml-4">
            <Button
              size="small"
              onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
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
            <ClearIcon className="text-txt text-opacity-text-primary" />
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
