import {
  MDCFixedTopAppBarFoundation,
  MDCShortTopAppBarFoundation,
  MDCTopAppBarAdapter,
  MDCTopAppBarFoundation,
} from '@material/top-app-bar'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import useClassList from '../../hooks/useClassList'

const BASE = 'mdc-top-app-bar'
const SECTION = `${BASE}__section`

const CSS_CLASSES = {
  BASE,
  ROW: `${BASE}__row`,
  SECTION,
  SECTION_START: `${SECTION}--align-start`,
  SECTION_END: `${SECTION}--align-end`,
  FIXED: `${BASE}--fixed`,
  SHORT: `${BASE}--short`,
  SHORT_COLLAPSED: `${BASE}--short-collapsed`,
  PROMINENT: `${BASE}--prominent`,
  DENSE: `${BASE}--dense`,
  TITLE: `${BASE}__title`,
  ACTION_ITEM: `${BASE}__action-item`,
  NAV_ICON: `${BASE}__navigation-icon`,
}

export interface TopAppbarFixedAdjustProps {
  tag?: string
  className?: string
  dense?: boolean
  prominent?: boolean
  short?: boolean
}

export const TopAppBarFixedAdjust: React.FunctionComponent<TopAppbarFixedAdjustProps> = ({
  tag: Tag = 'main',
  children,
  className = '',
  dense = false,
  prominent = false,
  short = false,
  ...otherProps
}) => {
  const base = 'mdc-top-app-bar'
  const suffix = '-fixed-adjust'
  const classes = classNames(className, {
    [`${base}--short${suffix}`]: short,
    [`${base}--dense${suffix}`]: dense && !prominent,
    [`${base}--dense-prominent${suffix}`]: dense && prominent,
    [`${base}--prominent${suffix}`]: !dense && prominent,
    [`${base}-${suffix}`]: !short && !dense && !prominent,
  })

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635
    // @ts-ignore
    <Tag className={classes} {...otherProps}>
      {children}
    </Tag>
  )
}

export interface TopAppBarIconProps<T> extends React.HTMLProps<T> {
  actionItem?: boolean
  className?: string
  children: React.ReactElement<any>
  navIcon?: boolean
}

export const TopAppBarIcon: <T extends Element = HTMLElement>(
  props: TopAppBarIconProps<T>
) => React.ReactElement<HTMLElement> = ({
  actionItem = false,
  navIcon = false,
  className,
  children,
  ...otherProps
}) => {
  return React.cloneElement(children, {
    ...otherProps,
    className: classNames(className, children.props.className, {
      [CSS_CLASSES.ACTION_ITEM]: actionItem,
      [CSS_CLASSES.NAV_ICON]: navIcon,
    }),
  })
}

export interface TopAppBarRowProps<T> extends React.HTMLProps<T> {
  className?: string
  tag?: string
}

export const TopAppBarRow: <T extends HTMLElement = HTMLDivElement>(
  props: TopAppBarRowProps<T>
) => React.ReactElement<T> = ({
  children,
  className,
  tag: Tag = 'div',
  ...otherProps
}) => {
  return (
    // @ts-ignore  https://github.com/Microsoft/TypeScript/issues/28892
    <Tag className={classNames(className, CSS_CLASSES.ROW)} {...otherProps}>
      {children}
    </Tag>
  )
}

export interface TopAppBarSectionProps<T> extends React.HTMLProps<T> {
  align?: 'start' | 'end'
  className?: string
  tag?: string
}

export const TopAppBarSection: <T extends HTMLElement = HTMLElement>(
  props: TopAppBarSectionProps<T>
) => React.ReactElement<T> = ({
  align,
  className,
  children,
  tag: Tag = 'section',
  ...otherProps
}) => {
  return (
    // @ts-ignore  https://github.com/Microsoft/TypeScript/issues/28892
    <Tag
      className={classNames(className, CSS_CLASSES.SECTION, {
        [CSS_CLASSES.SECTION_START]: align === 'start',
        [CSS_CLASSES.SECTION_END]: align === 'end',
      })}
      {...otherProps}
    >
      {children}
    </Tag>
  )
}

export interface TopAppBarTitleProps<T> extends React.HTMLProps<T> {
  className?: string
  tag?: string
}

export const TopAppBarTitle: <T extends HTMLElement = HTMLSpanElement>(
  props: TopAppBarTitleProps<T>
) => React.ReactElement<T> = ({
  children,
  className,
  tag: Tag = 'span',
  ...otherProps
}) => {
  return (
    // @ts-ignore  https://github.com/Microsoft/TypeScript/issues/28892
    <Tag className={classNames(className, CSS_CLASSES.TITLE)} {...otherProps}>
      {children}
    </Tag>
  )
}

export interface TopAppBarProps extends React.HTMLProps<HTMLElement> {
  className?: string
  dense?: boolean
  fixed?: boolean
  prominent?: boolean
  short?: boolean
  shortCollapsed?: boolean
  style?: React.CSSProperties
  scrollTarget?: React.RefObject<HTMLElement>
  onNavIconClicked?: () => void
}

const TopAppBar: React.FC<TopAppBarProps> = ({
  children,
  className = '',
  dense = false,
  fixed = false,
  short = false,
  shortCollapsed = false,
  prominent = false,
  scrollTarget,
  style = {},
  onNavIconClicked,
  ...otherProps
}) => {
  const { classList, addClass, removeClass } = useClassList()
  const [activeStyles, setStyles] = useState<React.CSSProperties>({})
  const foundationRef = useRef(null)
  const headerRef = useRef(null)

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  const onNavIconClickedRef = useRef(onNavIconClicked)

  useEffect(() => {
    onNavIconClickedRef.current = onNavIconClicked
  }, [onNavIconClicked])

  useEffect(() => {
    const adapter: MDCTopAppBarAdapter = {
      addClass,
      removeClass,
      hasClass: (cls) => {
        return classListRef.current.includes(cls)
      },
      setStyle: (varName, value) => {
        setStyles((prevStyles) => {
          const updatedStyle = Object.assign({}, prevStyles)
          // @ts-ignore
          updatedStyle[varName as keyof React.CSSProperties] = value
          return updatedStyle
        })
      },
      getTopAppBarHeight: () => {
        if (headerRef?.current) {
          return headerRef.current.clientHeight
        }
        return 0
      },
      getViewportScrollY: () => {
        return scrollTarget?.current
          ? scrollTarget.current.scrollTop
          : window.pageYOffset
      },
      getTotalActionItems: () => {
        if (headerRef?.current) {
          const actionItems = headerRef.current.querySelectorAll(
            `.${CSS_CLASSES.ACTION_ITEM}`
          )
          return actionItems.length
        }
        return 0
      },
      notifyNavigationIconClicked: () => {
        if (onNavIconClickedRef.current) {
          onNavIconClickedRef.current()
        }
      },
    }

    if (short || shortCollapsed) {
      foundationRef.current = new MDCShortTopAppBarFoundation(adapter)
    } else if (fixed) {
      foundationRef.current = new MDCFixedTopAppBarFoundation(adapter)
    } else {
      foundationRef.current = new MDCTopAppBarFoundation(adapter)
    }

    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [addClass, fixed, removeClass, scrollTarget, short, shortCollapsed])

  useEffect(() => {
    const handler = () => foundationRef.current.handleTargetScroll()

    const eventTarget = scrollTarget?.current ? scrollTarget.current : window

    eventTarget.addEventListener('scroll', handler)

    return () => {
      eventTarget.removeEventListener('scroll', handler)
    }
  }, [scrollTarget])

  useEffect(() => {
    const handler = () => foundationRef.current.handleWindowResize()

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  const classes = classNames(
    CSS_CLASSES.BASE,
    Array.from(classList),
    className,
    {
      [CSS_CLASSES.FIXED]: fixed,
      [CSS_CLASSES.SHORT]: shortCollapsed || short,
      [CSS_CLASSES.SHORT_COLLAPSED]: shortCollapsed,
      [CSS_CLASSES.PROMINENT]: prominent,
      [CSS_CLASSES.DENSE]: dense,
    }
  )

  return (
    <header
      {...otherProps}
      className={classes}
      style={Object.assign({}, style, activeStyles)}
      ref={headerRef}
    >
      {children}
    </header>
  )
}

export default TopAppBar
