import React, { useState, useEffect, useRef, useCallback } from 'react'

import { MDCRippleFoundation, MDCRippleAdapter, util } from '@material/ripple'
import { ponyfill, events } from '@material/dom'

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

    const eventListener: EventListener = event => handlerRef.current(event)

    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element]) // Re-run if eventName or element changes
}

export function useRipple<T extends HTMLElement>({
  ref,
  unbounded = false,
  disabled = false,
  computeBoundingRect,
}: {
  ref: React.RefObject<T>
  unbounded?: boolean
  disabled?: boolean
  computeBoundingRect?: (surface: T) => ClientRect
}): [React.CSSProperties, string] {
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [classList, setClassList] = useState<string[]>([])
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
    const surface = ref.current

    const adapter: MDCRippleAdapter = {
      browserSupportsCssVars: () => util.supportsCssVariables(window),
      isUnbounded: () => unboundedRef.current,
      isSurfaceActive: () => {
        return ponyfill.matches(surface, ':active')
      },
      isSurfaceDisabled: () => disabledRef.current,
      addClass: className => {
        if (!isCurrent) {
          return
        }
        setClassList(prevList => {
          const classSet = new Set(prevList)
          classSet.add(className)
          return Array.from(classSet)
        })
      },
      removeClass: className => {
        if (!isCurrent) {
          return
        }
        setClassList(prevList => {
          const classSet = new Set(prevList)
          classSet.delete(className)
          return Array.from(classSet)
        })
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
      registerResizeHandler: handler => {
        window.addEventListener('resize', handler)
      },
      deregisterResizeHandler: handler => {
        window.removeEventListener('resize', handler)
      },
      updateCssVariable: (varName, value) => {
        if (!isCurrent) {
          return
        }

        setStyle(prevStyle => {
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
      containsEventTarget: target => {
        if (surface && target !== null) {
          return surface.contains(target as Node)
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
  }, [computeBoundingRect, ref])

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

  useEventListener('focus', activateRipple, ref.current)
  useEventListener('blur', deactivateRipple, ref.current)

  useEventListener('mousedown', activateRipple, ref.current)
  useEventListener('mouseup', deactivateRipple, ref.current)

  useEventListener('touchstart', activateRipple, ref.current)
  useEventListener('touchend', deactivateRipple, ref.current)

  useEventListener('keydown', activateRipple, ref.current)
  useEventListener('keyup', deactivateRipple, ref.current)

  return [style, Array.from(classList).join(' ')]
}
