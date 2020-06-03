import {
  MDCIconButtonToggleAdapter,
  MDCIconButtonToggleFoundation,
} from '@material/icon-button'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import useClassList from '../../hooks/useClassList'

interface ToggleProps {
  on?: boolean
  className?: string
}

export const IconButtonToggle: React.FC<ToggleProps> = ({
  on = false,
  className = '',
  children,
}) => {
  const classes = classNames('mdc-icon-button__icon', className, {
    'mdc-icon-button__icon--on': on,
  })

  return <div className={classes}>{children}</div>
}

type Props =
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)

const IconButton: React.FC<Props> = ({
  className,
  style,
  children,
  ...props
}) => {
  const { classList, addClass, removeClass } = useClassList()
  const foundationRef = useRef<MDCIconButtonToggleFoundation>(null)
  const [attrs, setAttrs] = useState<React.HTMLAttributes<HTMLElement>>({})

  const ref = useRef(null)
  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  useEffect(() => {
    const adapter: MDCIconButtonToggleAdapter = {
      addClass,
      removeClass,
      hasClass: (cls) => {
        return classListRef.current.includes(cls)
      },
      setAttr: (attr, value) => {
        setAttrs((prevAttrs) => ({ ...prevAttrs, [attr]: value }))
      },
      notifyChange: () => {},
    }

    foundationRef.current = new MDCIconButtonToggleFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [addClass, removeClass])

  const classes = classNames(
    'mdc-icon-button flex items-center',
    classList,
    className
  )

  if ('href' in props) {
    return (
      <a {...props} {...attrs} className={classes} ref={ref}>
        {children}
      </a>
    )
  }

  return (
    <button {...props} {...attrs} className={classes} ref={ref}>
      {children}
    </button>
  )
}

export default IconButton
