import type { TooltipPopupProps, TooltipProps } from '@reach/tooltip'
import { TooltipPopup as ReachTooltipPopup, useTooltip } from '@reach/tooltip'
import type * as Polymorphic from '@reach/utils/polymorphic'
import classnames from 'classnames'
import { Children, cloneElement, forwardRef } from 'react'

import { useTheme } from '../Theme'

export const Tooltip = forwardRef(function Tooltip(props, forwardedRef) {
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
  })

  return (
    <>
      {cloneElement(child, trigger as any)}
      <TooltipPopup
        ref={forwardedRef}
        aria-label={props.ariaLabel}
        {...tooltip}
        {...props}
      />
    </>
  )
}) as Polymorphic.ForwardRefComponent<'div', TooltipProps>

export const TooltipPopup = forwardRef(function TooltipPopup(
  props,
  forwardedRef
) {
  const { theme } = useTheme()
  return (
    <ReachTooltipPopup
      {...props}
      ref={forwardedRef}
      className={classnames(
        props.className,
        {
          '__light-mode': theme === 'dark',
          '__dark-mode': theme === 'light',
        },
        'z-1 p-2 pointer-events-none absolute whitespace-nowrap text-txt text-opacity-text-primary bg-surface shadow-lg rounded'
      )}
    />
  )
}) as Polymorphic.ForwardRefComponent<'div', TooltipPopupProps>
