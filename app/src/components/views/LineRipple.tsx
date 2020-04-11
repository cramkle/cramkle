import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { MDCLineRippleFoundation } from '@material/line-ripple/foundation'
import { MDCLineRippleAdapter } from '@material/line-ripple/adapter'

import useClassList from 'hooks/useClassList'

export interface LineRippleProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  active?: boolean
  rippleCenter?: number
}

const LineRipple: React.FC<LineRippleProps> = ({
  style,
  className,
  active = false,
  rippleCenter = 0,
  ...otherProps
}) => {
  const { classList, addClass, removeClass } = useClassList()
  const [activeStyles, setStyles] = useState<React.CSSProperties>({})
  const foundationRef = useRef<MDCLineRippleFoundation>(null)

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  useEffect(() => {
    const adapter: MDCLineRippleAdapter = {
      addClass,
      removeClass,
      hasClass: (className) => classListRef.current.includes(className),
      setStyle: (varName, value) => {
        setStyles((prevStyles) => {
          const updatedStyle = Object.assign({}, prevStyles)
          // @ts-ignore
          updatedStyle[varName as keyof React.CSSProperties] = value
          return updatedStyle
        })
      },
      registerEventHandler: () => null,
      deregisterEventHandler: () => null,
    }

    foundationRef.current = new MDCLineRippleFoundation(adapter)
    foundationRef.current.init()

    return () => foundationRef.current.destroy()
  }, [addClass, removeClass])

  useEffect(() => {
    if (active) {
      foundationRef.current.activate()
    } else {
      foundationRef.current.deactivate()
    }
  }, [foundationRef, active])

  useEffect(() => {
    if (rippleCenter) {
      foundationRef.current.setRippleCenter(rippleCenter)
    }
  }, [rippleCenter])

  const handleTransitionEnd = (evt: React.TransitionEvent<Element>) => {
    foundationRef.current.handleTransitionEnd(evt.nativeEvent)
  }

  const classes = classNames(
    'mdc-line-ripple',
    Array.from(classList),
    className
  )

  return (
    <div
      className={classes}
      style={Object.assign({}, style, activeStyles)}
      onTransitionEnd={handleTransitionEnd}
      {...otherProps}
    />
  )
}

export default LineRipple
