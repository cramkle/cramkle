import type { MDCIconButtonToggleAdapter } from '@material/icon-button'
import { MDCIconButtonToggleFoundation } from '@material/icon-button'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'

import useClassList from '../../hooks/useClassList'

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
  const foundationRef = useRef<MDCIconButtonToggleFoundation | null>(null)
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
      foundationRef.current?.destroy()
    }
  }, [addClass, removeClass])

  const classes = classNames(
    'mdc-icon-button flex items-center outline-reset',
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
