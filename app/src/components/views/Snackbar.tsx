import { MDCSnackbarAdapter, MDCSnackbarFoundation } from '@material/snackbar'
import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

import useClassList from 'hooks/useClassList'

export interface Props {
  message: string
  className?: string
  timeoutMs?: number
  closeOnEscape?: boolean
  actionText?: string
  leading?: boolean
  stacked?: boolean
  open?: boolean
  reason?: string
  onOpening?: () => void
  onOpen?: () => void
  onClosing?: (reason: string) => void
  onClose?: (reason: string) => void
  onAnnounce?: () => void
}

export const Snackbar: React.FC<Props> = ({
  message,
  actionText,
  timeoutMs,
  closeOnEscape,
  open = true,
  stacked = false,
  leading = false,
  onAnnounce,
  onOpening,
  onOpen,
  onClosing,
  onClose,
  reason,
  className,
}) => {
  const foundationRef = useRef<MDCSnackbarFoundation | null>(null)
  const { classList, addClass, removeClass } = useClassList()

  useEffect(() => {
    const adapter: MDCSnackbarAdapter = {
      addClass,
      removeClass,
      announce: () => {
        // Usually it works automatically if this component uses conditional rendering
        onAnnounce && onAnnounce()
      },
      notifyOpening: () => {
        if (onOpening) {
          onOpening()
        }
      },
      notifyOpened: () => {
        if (onOpen) {
          onOpen()
        }
      },
      notifyClosing: reason => {
        if (onClosing) {
          onClosing(reason)
        }
      },
      notifyClosed: reason => {
        if (onClose) {
          onClose(reason)
        }
      },
    }

    foundationRef.current = new MDCSnackbarFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [addClass, onAnnounce, onClose, onClosing, onOpen, onOpening, removeClass])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    foundationRef.current.handleKeyDown(e.nativeEvent)
  }

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    foundationRef.current.handleActionButtonClick(e.nativeEvent)
  }

  useEffect(() => {
    if (timeoutMs) {
      foundationRef.current.setTimeoutMs(timeoutMs)
    }
  }, [timeoutMs])

  useEffect(() => {
    if (closeOnEscape) {
      foundationRef.current.setCloseOnEscape(closeOnEscape)
    }
  }, [closeOnEscape])

  useEffect(() => {
    if (open) {
      foundationRef.current.open()
    } else {
      foundationRef.current.close(reason ? reason : '')
    }
  }, [open, reason])

  const classes = classNames(className, 'mdc-snackbar', classList, {
    'mdc-snackbar--leading': leading,
    'mdc-snackbar--stacked': stacked,
  })

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={classes} onKeyDown={handleKeyDown}>
      <div className="mdc-snackbar__surface">
        <div className="mdc-snackbar__label" role="status" aria-live="polite">
          {message}
        </div>
        {actionText ? (
          <div className="mdc-snackbar__actions">
            <button
              type="button"
              onClick={handleActionClick}
              className="mdc-button mdc-snackbar__action"
            >
              {actionText}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
