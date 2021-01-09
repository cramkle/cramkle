import {
  TooltipPopup as ReachTooltipPopup,
  TooltipPopupProps,
  TooltipProps,
  useTooltip,
} from '@reach/tooltip'
import { forwardRefWithAs } from '@reach/utils'
import classnames from 'classnames'
import { Children, cloneElement } from 'react'

import { useTheme } from '../Theme'

export const Tooltip = forwardRefWithAs<TooltipProps, 'div'>(function Tooltip(
  props,
  forwardedRef
) {
  const child = Children.only(props.children) as any

  // We need to pass some properties from the child into useTooltip
  // to make sure users can maintain control over the trigger's ref and events
  const [trigger, tooltip] = useTooltip({
    id: props.id,
    onMouseEnter: child.props.onMouseEnter,
    onMouseMove: child.props.onMouseMove,
    onMouseLeave: child.props.onMouseLeave,
    onFocus: child.props.onFocus,
    onBlur: child.props.onBlur,
    onKeyDown: child.props.onKeyDown,
    onMouseDown: child.props.onMouseDown,
    ref: child.ref,
    DEBUG_STYLE: props.DEBUG_STYLE,
  })

  return (
    <>
      {cloneElement(child, trigger as any)}
      <TooltipPopup
        ref={forwardedRef}
        label={props.label}
        aria-label={props.ariaLabel}
        {...tooltip}
        {...props}
      />
    </>
  )
})

export const TooltipPopup = forwardRefWithAs<TooltipPopupProps, 'div'>(
  function TooltipPopup(props, forwardedRef) {
    const { theme } = useTheme()

    return (
      <ReachTooltipPopup
        {...props}
        ref={forwardedRef}
        className={classnames(
          props.className,
          'z-1 p-2 pointer-events-none absolute whitespace-nowrap text-primary bg-surface shadow-lg rounded',
          {
            '__dark-mode': theme === 'light',
            '__light-mode': theme === 'dark',
          }
        )}
      />
    )
  }
)
