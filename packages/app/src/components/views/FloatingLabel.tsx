import React, { useEffect, useImperativeHandle, useRef } from 'react'
import classNames from 'classnames'
import {
  MDCFloatingLabelAdapter,
  MDCFloatingLabelFoundation,
  cssClasses,
} from '@material/floating-label'

import useClassList from 'hooks/useClassList'

export interface FloatingLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  onWidthChange?: (width: number) => void
  float?: boolean
}

const FloatingLabel: React.RefForwardingComponent<
  { shake: () => void },
  FloatingLabelProps
> = (
  { className, children, onWidthChange, float = false, ...otherProps },
  ref
) => {
  const foundationRef = useRef<MDCFloatingLabelFoundation>(null)
  const labelElement = useRef<HTMLLabelElement>()
  const { classList, addClass, removeClass } = useClassList()

  useEffect(() => {
    const adapter: MDCFloatingLabelAdapter = {
      addClass,
      removeClass,
      // the adapter methods below are effectively useless since React
      // handles events and width differently
      registerInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      // Always returns 0 beacuse MDC Web component does
      // only proxies to foundation.getWidth.
      // MDC React instead passes it from the text-field
      // component to floating-label component.
      getWidth: () => 0,
    }

    foundationRef.current = new MDCFloatingLabelFoundation(adapter)
    foundationRef.current.init()

    return () => foundationRef.current.destroy()
  }, [addClass, removeClass])

  useEffect(() => {
    foundationRef.current.float(float)
  }, [float])

  useEffect(() => {
    if (onWidthChange && labelElement.current) {
      onWidthChange(labelElement.current.offsetWidth)
    }
  }, [children, onWidthChange])

  useImperativeHandle(ref, () => ({
    shake: () => foundationRef.current.shake(true),
  }))

  const onShakeEnd = () => {
    removeClass(cssClasses.LABEL_SHAKE)
  }

  const classes = classNames(cssClasses.ROOT, Array.from(classList), className)

  return (
    <label
      className={classes}
      ref={labelElement}
      onAnimationEnd={onShakeEnd}
      {...otherProps}
    >
      {children}
    </label>
  )
}

export default FloatingLabel
