import classNames from 'classnames'
import React, { useRef } from 'react'

import { useRipple } from './Ripple'
import { IconTypes } from './IconTypes'

import styles from './Icon.scss'

interface Props extends React.HTMLAttributes<HTMLElement> {
  icon?: IconTypes
  className?: string
  hasRipple?: boolean
  unbounded?: boolean
}

const Icon: React.FunctionComponent<Props> = ({
  icon = '',
  className,
  unbounded,
  hasRipple = false,
  ...otherProps
}) => {
  const ref = useRef<HTMLElement>(null)
  const { rippleClasses, rippleStyle } = useRipple({
    surfaceRef: ref,
    disabled: !hasRipple,
  })

  const classes = classNames('material-icons', className, rippleClasses, {
    [styles.rippleSurface]: hasRipple,
  })

  return (
    <i style={rippleStyle} className={classes} ref={ref} {...otherProps}>
      {icon}
    </i>
  )
}

export default Icon
