import { cssClasses, strings, numbers, util } from '@material/dialog'
import { ponyfill } from '@material/dom'
import classNames from 'classnames'
import { FocusTrap } from 'focus-trap'
import React, { useRef, useEffect, useReducer } from 'react'

import Button from './Button'

type DivAttributes = React.HTMLAttributes<HTMLDivElement>

export const DialogTitle: React.FC<DivAttributes> = ({
  className,
  children,
  ...props
}) => {
  const classes = classNames('mdc-dialog__title', className)

  return (
    <h2 {...props} className={classes}>
      {children}
    </h2>
  )
}

export const DialogContent: React.FC<DivAttributes> = ({
  className,
  children,
  ...props
}) => {
  const classes = classNames('mdc-dialog__content', className)

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export const DialogActions: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  children,
  ...props
}) => {
  const classes = classNames('mdc-dialog__actions', className)

  return (
    <footer className={classes} {...props}>
      {React.Children.map(children, element => {
        if (typeof element !== 'object' || !('props' in element)) {
          return element
        }

        if (element.type !== Button) {
          return element
        }

        return React.cloneElement(element, {
          className: classNames(
            element.props && element.props.className,
            'mdc-dialog__button'
          ),
        })
      })}
    </footer>
  )
}

interface DialogState {
  // this opened state only exists so our animation is
  // smooth, since we can't update the `opening` and `closing`
  // states in the same render as the `open` prop changes
  opened: boolean
  opening: boolean
  closing: boolean
}

type Action =
  | { type: 'opening_start' }
  | { type: 'opening_tick' }
  | { type: 'opening_end' }
  | { type: 'closing_start' }
  | { type: 'closing_end' }

const initialState: DialogState = {
  opening: false,
  closing: false,
  opened: false,
}

const reducer = (state: DialogState, action: Action): DialogState => {
  switch (action.type) {
    case 'opening_start': {
      return {
        opened: false,
        opening: true,
        closing: false,
      }
    }
    case 'opening_tick': {
      return {
        closing: false,
        opening: true,
        opened: true,
      }
    }
    case 'opening_end': {
      return {
        closing: false,
        opening: false,
        opened: true,
      }
    }
    case 'closing_start': {
      return {
        opened: false,
        opening: false,
        closing: true,
      }
    }
    case 'closing_end': {
      return {
        opening: false,
        closing: false,
        opened: false,
      }
    }
    default:
      return state
  }
}

interface DialogProps extends DivAttributes {
  autoStackButtons?: boolean
  className?: string
  role?: 'alertdialog' | 'dialog'
  open: boolean
  onClose: () => void
}

const Dialog: React.FC<DialogProps> = ({
  children,
  className,
  role = 'alertdialog',
  open,
  onClose,
  autoStackButtons,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const focusTrapRef = useRef<FocusTrap>(null)

  const dialogRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    focusTrapRef.current = util.createFocusTrapInstance(dialogRef.current)
  }, [])

  useEffect(() => {
    let animationFrame: number
    let timeoutId: NodeJS.Timeout

    if (open) {
      dispatch({ type: 'opening_start' })

      animationFrame = requestAnimationFrame(() => {
        dispatch({ type: 'opening_tick' })

        timeoutId = setTimeout(() => {
          dispatch({ type: 'opening_end' })
          focusTrapRef.current.activate()
        }, numbers.DIALOG_ANIMATION_OPEN_TIME_MS)
      })
    } else {
      dispatch({ type: 'closing_start' })

      timeoutId = setTimeout(() => {
        focusTrapRef.current.deactivate()
        dispatch({ type: 'closing_end' })
      }, numbers.DIALOG_ANIMATION_CLOSE_TIME_MS)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [open])

  useEffect(() => {
    if (state.opened) {
      document.body.classList.add(cssClasses.SCROLL_LOCK)
    } else {
      document.body.classList.remove(cssClasses.SCROLL_LOCK)
    }
  }, [state.opened, state.opening])

  useEffect(() => {
    if (open) {
      const handleDocumentKeyDown = (evt: KeyboardEvent) => {
        const isEscape = evt.key === 'Escape' || evt.keyCode === 27
        if (isEscape) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleDocumentKeyDown)

      return () => {
        document.removeEventListener('keydown', handleDocumentKeyDown)
      }
    }
  }, [onClose, open])

  useEffect(() => {
    const handleDocumentClick = (evt: MouseEvent) => {
      if (ponyfill.matches(evt.target as Element, strings.SCRIM_SELECTOR)) {
        onClose()
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => document.removeEventListener('click', handleDocumentClick)
  }, [onClose])

  const classes = classNames('mdc-dialog', className, {
    [cssClasses.OPEN]: state.opened,
    [cssClasses.OPENING]: state.opening,
    [cssClasses.CLOSING]: state.closing,
    [cssClasses.STACKED]: autoStackButtons,
  })

  return (
    <div className={classes} role={role} aria-modal ref={dialogRef}>
      <div className="mdc-dialog__container">
        <div className="mdc-dialog__surface">{children}</div>
      </div>
      <div className="mdc-dialog__scrim" ref={scrimRef}></div>
    </div>
  )
}

export default Dialog
