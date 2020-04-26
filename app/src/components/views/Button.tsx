import classNames from 'classnames'
import React, { useRef } from 'react'

import { useRipple } from './Ripple'

const CSS_CLASSES = {
  ROOT: 'mdc-button',
  ICON: 'mdc-button__icon',
  LABEL: 'mdc-button__label',
  DENSE: 'mdc-button--dense',
  RAISED: 'mdc-button--raised',
  OUTLINED: 'mdc-button--outlined',
  UNELEVATED: 'mdc-button--unelevated',
}

type ConditionalProps =
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | React.ButtonHTMLAttributes<HTMLButtonElement>

type Props = {
  raised?: boolean
  unelevated?: boolean
  outlined?: boolean
  dense?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactElement<React.HTMLProps<HTMLOrSVGElement>>
  trailingIcon?: React.ReactElement<React.HTMLProps<HTMLOrSVGElement>>
} & ConditionalProps

const renderIcon = (
  icon?: React.ReactElement<React.HTMLProps<HTMLOrSVGElement>>
) =>
  icon
    ? React.cloneElement(icon, {
        className: classNames(CSS_CLASSES.ICON, icon.props.className),
      })
    : null

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (
    {
      className = '',
      raised = false,
      unelevated = false,
      outlined = false,
      dense = false,
      icon,
      children,
      trailingIcon,
      style,
      ...props
    },
    inputRef
  ) => {
    const ref = useRef<any>(null)

    const { rippleStyle, rippleClasses } = useRipple({ surfaceRef: ref })

    const classes = classNames(CSS_CLASSES.ROOT, className, rippleClasses, {
      [CSS_CLASSES.RAISED]: raised,
      [CSS_CLASSES.UNELEVATED]: unelevated,
      [CSS_CLASSES.OUTLINED]: outlined,
      [CSS_CLASSES.DENSE]: dense,
    })

    const elementStyle = {
      ...rippleStyle,
      ...style,
    }

    const assignRef = (node: HTMLButtonElement | HTMLAnchorElement) => {
      ref.current = node

      if (inputRef == null) {
        return
      }

      if (typeof inputRef === 'function') {
        inputRef(node)
      } else {
        inputRef.current = node
      }
    }

    if ('href' in props) {
      return (
        <a {...props} className={classes} ref={assignRef} style={elementStyle}>
          {!trailingIcon ? renderIcon(icon) : null}
          <span className={CSS_CLASSES.LABEL}>{children}</span>
          {trailingIcon ? renderIcon(trailingIcon) : null}
        </a>
      )
    }

    return (
      <button
        {...props}
        style={elementStyle}
        className={classes}
        ref={assignRef}
      >
        {!trailingIcon ? renderIcon(icon) : null}
        <span className={CSS_CLASSES.LABEL}>{children}</span>
        {trailingIcon ? renderIcon(trailingIcon) : null}
      </button>
    )
  }
)

export default Button
