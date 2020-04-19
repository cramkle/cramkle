import {
  MDCFadingTabIndicatorFoundation,
  MDCSlidingTabIndicatorFoundation,
  MDCTabIndicatorAdapter,
} from '@material/tab-indicator'
import classNames from 'classnames'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export interface TabIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean
  className?: string
  fade?: boolean
  icon?: boolean
  previousIndicatorClientRect?: ClientRect
}

interface TabIndicatorRef {
  computeContentClientRect: () => ClientRect
}

const TabIndicator: React.RefForwardingComponent<
  TabIndicatorRef,
  TabIndicatorProps
> = (
  {
    active = false,
    children,
    className,
    fade = false,
    icon = false,
    previousIndicatorClientRect,
    ...otherProps
  },
  ref
) => {
  const [_, setCounter] = useState<number>(0)
  const forceUpdate = useCallback(() => setCounter((prev) => prev + 1), [])

  const tabIndicatorElement = useRef<HTMLSpanElement>(null)
  const foundationRef = useRef<
    MDCFadingTabIndicatorFoundation | MDCSlidingTabIndicatorFoundation
  >(null)

  const getNativeContentElement = () => {
    if (!tabIndicatorElement.current) {
      return
    }
    // need to use getElementsByClassName since tabIndicator could be
    // a non-semantic element (span, i, etc.). This is a problem since refs to a non semantic elements
    // return the instance of the component.
    return tabIndicatorElement.current.querySelector(
      '.mdc-tab-indicator__content'
    )
  }

  const computeContentClientRect = useCallback(() => {
    const contentElement = getNativeContentElement()
    if (!contentElement?.getBoundingClientRect) {
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
    return contentElement.getBoundingClientRect()
  }, [])

  useEffect(() => {
    const adapter: MDCTabIndicatorAdapter = {
      addClass: (className: string) => {
        if (!tabIndicatorElement.current) {
          return
        }
        // since the sliding indicator depends on the FLIP method,
        // our regular pattern of managing classes does not work here.
        // setState is async, which does not work well with the FLIP method
        // without a requestAnimationFrame, which was done in this PR:
        // https://github.com/material-components
        // /material-components-web/pull/3337/files#diff-683d792d28dad99754294121e1afbfb5L62
        tabIndicatorElement.current.classList.add(className)
        forceUpdate()
      },
      removeClass: (className: string) => {
        if (!tabIndicatorElement.current) {
          return
        }
        tabIndicatorElement.current.classList.remove(className)
        forceUpdate()
      },
      computeContentClientRect,
      // setContentStyleProperty was using setState, but due to the method's
      // async nature, its not condusive to the FLIP technique
      setContentStyleProperty: (prop: string, value: string) => {
        const contentElement = getNativeContentElement() as HTMLElement
        // we need to cast prop from string (interface requirement) to CSSStyleDeclaration;
        const typedProp = prop as keyof CSSStyleDeclaration
        // length and parentRule are readonly properties of CSSStyleDeclaration that
        // cannot be set
        if (
          !contentElement ||
          typedProp === 'length' ||
          typedProp === 'parentRule'
        ) {
          return
        }
        // https://github.com/Microsoft/TypeScript/issues/11914
        contentElement.style[typedProp] = value
      },
    }
    if (fade) {
      foundationRef.current = new MDCFadingTabIndicatorFoundation(adapter)
    } else {
      foundationRef.current = new MDCSlidingTabIndicatorFoundation(adapter)
    }
    foundationRef.current.init()

    return () => foundationRef.current.destroy()
  }, [computeContentClientRect, fade, forceUpdate])

  useEffect(() => {
    if (active) {
      foundationRef.current.activate(previousIndicatorClientRect)
    } else {
      foundationRef.current.deactivate()
    }
  }, [active, previousIndicatorClientRect])

  useImperativeHandle(
    ref,
    () => ({
      computeContentClientRect,
    }),
    [computeContentClientRect]
  )

  const classes = classNames('mdc-tab-indicator', className, {
    'mdc-tab-indicator--fade': fade,
  })

  const contentClasses = classNames('mdc-tab-indicator__content', {
    'mdc-tab-indicator__content--icon': icon,
    'mdc-tab-indicator__content--underline': !icon,
  })

  const childrenWithContentClasses = () => {
    const child = React.Children.only(children) as React.ReactElement<any>
    const className = classNames(child.props.className, contentClasses)
    const props = Object.assign({}, child.props, { className })
    return React.cloneElement(child, props)
  }

  const content = children ? (
    childrenWithContentClasses()
  ) : (
    <span className={contentClasses} />
  )

  return (
    <span className={classes} ref={tabIndicatorElement} {...otherProps}>
      {content}
    </span>
  )
}

export default React.forwardRef(TabIndicator)
