import classNames from 'classnames'
import React, { useRef } from 'react'

import styles from './Icon.scss'
import { IconTypes } from './IconTypes'
import { useRipple } from './Ripple'

interface Props extends React.HTMLAttributes<HTMLElement> {
  icon?: IconTypes
  className?: string
  rippled?: boolean
  unbounded?: boolean
}

const Icon: React.FunctionComponent<Props> = ({
  icon = '',
  className,
  unbounded = true,
  rippled = false,
  ...otherProps
}) => {
  const ref = useRef<HTMLElement>(null)
  const { rippleClasses, rippleStyle } = useRipple({
    surfaceRef: ref,
    disabled: !rippled,
    unbounded,
  })

  const classes = classNames('material-icons', className, rippleClasses, {
    [styles.rippleSurface]: rippled,
  })

  return (
    <i style={rippleStyle} className={classes} ref={ref} {...otherProps}>
      {icon}
    </i>
  )
}

export default Icon
