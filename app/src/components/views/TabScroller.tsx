import { ponyfill } from '@material/dom'
import {
  MDCTabScrollerAdapter,
  MDCTabScrollerFoundation,
  util,
} from '@material/tab-scroller'
import classNames from 'classnames'
import useClassList from 'hooks/useClassList'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

const convertDashToCamelCase = (propName: string) =>
  propName.replace(/-(\w)/g, (_, v) => v.toUpperCase())

export interface TabScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  alignStart?: boolean
  alignEnd?: boolean
  alignCenter?: boolean
  className?: string
}

export interface TabScrollerRef {
  getScrollContentWidth(): number
  getScrollPosition(): number
  incrementScroll(scroll: number): void
  scrollTo(scroll: number): void
}

const TabScroller: React.RefForwardingComponent<
  TabScrollerRef,
  TabScrollerProps
> = (
  {
    children,
    alignStart = false,
    alignEnd = false,
    alignCenter = false,
    className,
    onWheel = () => {},
    onTouchStart = () => {},
    onPointerDown = () => {},
    onMouseDown = () => {},
    onKeyDown = () => {},
    onTransitionEnd = () => {},
    ...otherProps
  },
  ref
) => {
  const { classList, addClass, removeClass } = useClassList()
  const {
    classList: areaClassList,
    addClass: addScrollAreaClass,
  } = useClassList()
  const areaElement = useRef<HTMLDivElement>(null)
  const contentElement = useRef<HTMLDivElement>(null)
  const foundationRef = useRef<MDCTabScrollerFoundation>(null)
  const [areaStyle, setAreaStyle] = useState<React.CSSProperties>({})
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({})

  const getScrollContentWidth = useCallback(() => {
    return contentElement.current ? contentElement.current.offsetWidth : 0
  }, [])

  const getScrollPosition = useCallback(() => {
    return foundationRef.current.getScrollPosition()
  }, [])

  const incrementScroll = useCallback((scrollXIncrement: number) => {
    foundationRef.current.incrementScroll(scrollXIncrement)
  }, [])

  const scrollTo = useCallback((scrollX: number) => {
    foundationRef.current.scrollTo(scrollX)
  }, [])

  useImperativeHandle<TabScrollerRef, TabScrollerRef>(
    ref,
    () => ({
      getScrollContentWidth,
      getScrollPosition,
      incrementScroll,
      scrollTo,
    }),
    [getScrollContentWidth, getScrollPosition, incrementScroll, scrollTo]
  )

  useEffect(() => {
    const getBoundingClientRectOf = (element: HTMLElement | null) => {
      if (!element) {
        // new DOMRect is not IE11 compatible
        const defaultDOMRect = {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        }
        return defaultDOMRect
      }
      return element.getBoundingClientRect()
    }
    const adapter: MDCTabScrollerAdapter = {
      eventTargetMatchesSelector: (evtTarget, selector) => {
        if (selector) {
          return ponyfill.matches(evtTarget as Element, selector)
        }
        return false
      },
      addClass,
      removeClass,
      addScrollAreaClass,
      setScrollAreaStyleProperty: (prop, value) => {
        setAreaStyle((prevStyles) => ({
          ...prevStyles,
          [convertDashToCamelCase(prop)]: value,
        }))
      },
      setScrollContentStyleProperty: (prop, value) => {
        setContentStyle((prevStyles) => ({
          ...prevStyles,
          [convertDashToCamelCase(prop)]: value,
        }))
      },
      getScrollContentStyleValue: (propName) =>
        contentElement.current
          ? window
              .getComputedStyle(contentElement.current)
              .getPropertyValue(propName)
          : '',
      setScrollAreaScrollLeft: (scrollX) => {
        if (!areaElement.current) {
          return
        }
        areaElement.current.scrollLeft = scrollX
      },
      getScrollAreaScrollLeft: () =>
        areaElement.current ? areaElement.current.scrollLeft : 0,
      getScrollContentOffsetWidth: getScrollContentWidth,
      getScrollAreaOffsetWidth: () =>
        areaElement.current ? areaElement.current.offsetWidth : 0,
      computeScrollAreaClientRect: () => {
        return getBoundingClientRectOf(contentElement.current)
      },
      computeScrollContentClientRect: () => {
        return getBoundingClientRectOf(contentElement.current)
      },
      computeHorizontalScrollbarHeight: () =>
        util.computeHorizontalScrollbarHeight(document),
    }

    foundationRef.current = new MDCTabScrollerFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [addClass, addScrollAreaClass, getScrollContentWidth, removeClass])

  const classes = classNames(
    'mdc-tab-scroller',
    Array.from(classList),
    className,
    {
      'mdc-tab-scroller--align-start': alignStart,
      'mdc-tab-scroller--align-end': alignEnd,
      'mdc-tab-scroller--align-center': alignCenter,
    }
  )

  const handleWheel = (evt: React.WheelEvent<HTMLDivElement>) => {
    onWheel?.(evt)
    foundationRef.current.handleInteraction()
  }

  const handleTouchStart = (evt: React.TouchEvent<HTMLDivElement>) => {
    onTouchStart?.(evt)
    foundationRef.current.handleInteraction()
  }

  const handlePointerDown = (evt: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(evt)
    foundationRef.current.handleInteraction()
  }

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    onMouseDown?.(evt)
    foundationRef.current.handleInteraction()
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(evt)
    foundationRef.current.handleInteraction()
  }

  const handleTransitionEnd = (evt: React.TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(evt)
    foundationRef.current.handleTransitionEnd(evt.nativeEvent)
  }

  const areaClasses = classNames(
    'mdc-tab-scroller__scroll-area',
    Array.from(areaClassList)
  )

  return (
    <div
      className={classes}
      role="presentation"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onTransitionEnd={handleTransitionEnd}
      {...otherProps}
    >
      <div className={areaClasses} style={areaStyle} ref={areaElement}>
        <div
          className="mdc-tab-scroller__scroll-content"
          style={contentStyle}
          ref={contentElement}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(TabScroller)
