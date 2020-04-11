import classNames from 'classnames'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { MDCRippleAdapter, MDCRippleFoundation, util } from '@material/ripple'
import { events, ponyfill } from '@material/dom'

import useClassList from 'hooks/useClassList'

const useEventListener = (
  eventName: string,
  handler: EventListener,
  element: EventTarget = window
) => {
  // Create a ref that stores handler
  const handlerRef = useRef<EventListener>(() => {})

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!element || !element.addEventListener) {
      return
    }

    const eventListener: EventListener = (event) => handlerRef.current(event)

    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element]) // Re-run if eventName or element changes
}

export function useRipple<T extends HTMLElement, U extends HTMLElement = T>({
  surfaceRef,
  activatorRef,
  unbounded = false,
  disabled = false,
  computeBoundingRect,
}: {
  surfaceRef: React.RefObject<T>
  activatorRef?: React.RefObject<U>
  unbounded?: boolean
  disabled?: boolean
  computeBoundingRect?: (surface: T) => ClientRect
}) {
  const [style, setStyle] = useState<React.CSSProperties>({})
  const { classList, addClass, removeClass } = useClassList()
  const foundationRef = useRef<MDCRippleFoundation>(null)

  const disabledRef = useRef(disabled)
  const unboundedRef = useRef(unbounded)

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    unboundedRef.current = unbounded
  }, [unbounded])

  useEffect(() => {
    let isCurrent = true
    const surface = surfaceRef.current
    const activator = activatorRef?.current

    const adapter: MDCRippleAdapter = {
      browserSupportsCssVars: () => util.supportsCssVariables(window),
      isUnbounded: () => unboundedRef.current,
      isSurfaceActive: () => {
        if (activator) {
          return ponyfill.matches(activator, ':active')
        }

        return ponyfill.matches(surface, ':active')
      },
      isSurfaceDisabled: () => disabledRef.current,
      addClass: (className) => {
        if (!isCurrent) {
          return
        }
        addClass(className)
      },
      removeClass: (className) => {
        if (!isCurrent) {
          return
        }
        removeClass(className)
      },
      registerDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.addEventListener(
          evtType,
          handler,
          events.applyPassive()
        )
      },
      deregisterDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.removeEventListener(
          evtType,
          handler,
          events.applyPassive()
        )
      },
      registerResizeHandler: (handler) => {
        window.addEventListener('resize', handler)
      },
      deregisterResizeHandler: (handler) => {
        window.removeEventListener('resize', handler)
      },
      updateCssVariable: (varName, value) => {
        if (!isCurrent) {
          return
        }

        setStyle((prevStyle) => {
          const updatedStyle = Object.assign({}, prevStyle)

          if (value === null) {
            delete updatedStyle[varName as keyof React.CSSProperties]
          } else {
            // @ts-ignore
            updatedStyle[varName as keyof React.CSSProperties] = value
          }

          return updatedStyle
        })
      },
      computeBoundingRect: () => {
        if (!isCurrent) {
          // need to return object since foundation expects it
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
        if (computeBoundingRect) {
          return computeBoundingRect(surface)
        }
        return surface.getBoundingClientRect()
      },
      containsEventTarget: (target) => {
        if (activator && target !== null) {
          return activator.contains(target as Node)
        }
        return false
      },
      registerInteractionHandler: () => null,
      deregisterInteractionHandler: () => null,
      getWindowPageOffset: () => ({
        x: window.pageXOffset,
        y: window.pageYOffset,
      }),
    }

    foundationRef.current = new MDCRippleFoundation(adapter)
    foundationRef.current.init()

    return () => {
      isCurrent = false
      foundationRef.current.destroy()
    }
  }, [computeBoundingRect, surfaceRef, activatorRef, addClass, removeClass])

  useEffect(() => {
    if (disabled) {
      foundationRef.current.handleBlur()
    }
  }, [foundationRef, disabled])

  const activateRipple = useCallback(
    (evt: Event) => {
      foundationRef.current.activate(evt)
    },
    [foundationRef]
  )

  const deactivateRipple = useCallback(() => {
    foundationRef.current.deactivate()
  }, [foundationRef])

  const eventTargetRef = activatorRef || surfaceRef

  const handleFocus = useCallback(() => {
    foundationRef.current.handleFocus()
  }, [foundationRef])

  const handleBlur = useCallback(() => {
    foundationRef.current.handleBlur()
  }, [foundationRef])

  useEventListener('focus', handleFocus, eventTargetRef.current)
  useEventListener('blur', handleBlur, eventTargetRef.current)

  useEventListener('mousedown', activateRipple, eventTargetRef.current)
  useEventListener('mouseup', deactivateRipple, eventTargetRef.current)

  useEventListener('touchstart', activateRipple, eventTargetRef.current)
  useEventListener('touchend', deactivateRipple, eventTargetRef.current)

  useEventListener('keydown', activateRipple, eventTargetRef.current)
  useEventListener('keyup', deactivateRipple, eventTargetRef.current)

  return {
    rippleStyle: style,
    rippleClasses: Array.from(classList).join(' '),
    rippleFoundation: foundationRef.current,
  }
}

interface RippleProps {
  className?: string
  unbounded?: boolean
  primary?: boolean
  secondary?: boolean
}

interface RippleRef {
  focus: () => void
  blur: () => void
}

export const RippleComponent: React.RefForwardingComponent<
  RippleRef,
  RippleProps
> = (
  { className, unbounded = false, primary = false, secondary = false },
  ref
) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const {
    rippleStyle,
    rippleClasses,
    rippleFoundation: foundation,
  } = useRipple({
    surfaceRef: elementRef,
    unbounded: true,
  })

  useImperativeHandle(
    ref,
    () => ({
      focus: () => foundation?.handleFocus(),
      blur: () => foundation?.handleBlur(),
    }),
    [foundation]
  )

  return (
    <div
      className={classNames(className, rippleClasses, 'mdc-ripple-surface', {
        'mdc-ripple-surface--primary': primary,
        'mdc-ripple-surface--secondary': secondary,
      })}
      style={rippleStyle}
      ref={elementRef}
      data-mdc-ripple-is-unbounded={unbounded}
    />
  )
}

export const Ripple = React.forwardRef(RippleComponent)
