import classNames from 'classnames'
import React, { useRef } from 'react'

// test pr

import { useRipple } from './Ripple'

const cssClasses = {
  ROOT: 'mdc-fab',
  ICON: 'mdc-fab__icon',
  LABEL: 'mdc-fab__label',
  MINI: 'mdc-fab--mini',
  EXTENDED: 'mdc-fab--extended',
  EXITED: 'mdc-fab--exited',
}

export interface FabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  exited?: boolean
  mini?: boolean
  icon?: React.ReactElement<HTMLElement>
  textLabel?: string
  className?: string
  initRipple?: React.Ref<HTMLButtonElement>
  unbounded?: boolean
}

const Icon: React.FunctionComponent<{
  icon?: React.ReactElement<HTMLElement>
}> = ({ icon }) => {
  if (!icon) {
    return null
  }
  const updatedProps = {
    className: classNames(cssClasses.ICON, icon.props.className),
  }
  return React.cloneElement(icon, updatedProps)
}

const TextLabel: React.FunctionComponent<{ textLabel: string }> = ({
  textLabel,
}) => {
  if (textLabel.length === 0) {
    return null
  }
  return <span className={cssClasses.LABEL}>{textLabel}</span>
}

const Fab: React.FunctionComponent<FabProps &
  React.HTMLProps<HTMLButtonElement>> = ({
  exited = false,
  mini = false,
  icon,
  textLabel = '',
  className = '',
  style,
  unbounded,
  ...otherProps
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { rippleStyle, rippleClasses } = useRipple({
    surfaceRef: buttonRef,
    unbounded,
  })

  const extended = textLabel.length > 0
  const classes = classNames(cssClasses.ROOT, className, rippleClasses, {
    [cssClasses.MINI]: mini,
    [cssClasses.EXTENDED]: extended,
    [cssClasses.EXITED]: exited,
  })

  return (
    <button
      style={{ ...style, ...rippleStyle }}
      className={classes}
      ref={buttonRef}
      {...otherProps}
    >
      <Icon icon={icon} />
      <TextLabel textLabel={textLabel} />
    </button>
  )
}

export default Fab
