import React, { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { MDCNotchedOutlineFoundation } from '@material/notched-outline/foundation'
import { MDCNotchedOutlineAdapter } from '@material/notched-outline/adapter'
import { MDCFloatingLabelFoundation } from '@material/floating-label/foundation'
const { cssClasses } = MDCNotchedOutlineFoundation

import useClassList from 'hooks/useClassList'

export interface NotchedOutlineProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  notchWidth?: number
  notch?: boolean
}

const NotchedOutline: React.FC<NotchedOutlineProps> = ({
  className = '',
  notchWidth = 0,
  notch = false,
  children,
  ...otherProps
}) => {
  const foundationRef = useRef<MDCNotchedOutlineFoundation>(null)
  const notchedEl = useRef<HTMLDivElement>()
  const { classList, addClass, removeClass } = useClassList()
  const [foundationNotchWidth, setNotchWidth] = useState<number | undefined>(
    undefined
  )

  const label = useMemo(() => {
    if (!notchedEl.current) {
      return null
    }
    return notchedEl.current.querySelector<HTMLElement>(
      `.${MDCFloatingLabelFoundation.cssClasses.ROOT}`
    )
  }, [])

  useEffect(() => {
    const adapter: MDCNotchedOutlineAdapter = {
      addClass,
      removeClass,
      setNotchWidthProperty: (foundationNotchWidth) =>
        setNotchWidth(foundationNotchWidth),
      removeNotchWidthProperty: () => setNotchWidth(undefined),
    }

    foundationRef.current = new MDCNotchedOutlineFoundation(adapter)
    foundationRef.current.init()

    return () => foundationRef.current.destroy()
  }, [addClass, removeClass])

  useEffect(() => {
    if (label) {
      label.style.transitionDuration = '0s'
      addClass(cssClasses.OUTLINE_UPGRADED)
      requestAnimationFrame(() => {
        if (label) {
          label.style.transitionDuration = ''
        }
      })
    }
  }, [addClass, label])

  useEffect(() => {
    if (!foundationRef.current) {
      return
    }

    if (notch) {
      foundationRef.current.notch(notchWidth)
    } else {
      foundationRef.current.closeNotch()
    }
  }, [notchWidth, notch])

  const classes = classNames(
    'mdc-notched-outline',
    Array.from(classList),
    className,
    {
      [cssClasses.NO_LABEL]: !label,
    }
  )

  const notchStyle = {
    width: foundationNotchWidth ? `${foundationNotchWidth}px` : undefined,
  }

  return (
    <div className={classes} ref={notchedEl} {...otherProps}>
      <div className="mdc-notched-outline__leading" />
      {children ? (
        <div className="mdc-notched-outline__notch" style={notchStyle}>
          {React.Children.only(children)}
        </div>
      ) : null}
      <div className="mdc-notched-outline__trailing" />
    </div>
  )
}

export default NotchedOutline
