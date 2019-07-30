import classNames from 'classnames'
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'

import { cssClasses, strings, numbers } from '@material/checkbox'
import { useRipple } from './Ripple'

export interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  className?: string
  disabled?: boolean
  indeterminate?: boolean
  name?: string
  nativeControlId?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
  unbounded?: boolean
}

const getTransitionAnimationClass = (
  oldState: string,
  newState: string
): string => {
  const {
    TRANSITION_STATE_INIT,
    TRANSITION_STATE_CHECKED,
    TRANSITION_STATE_UNCHECKED,
  } = strings

  const {
    ANIM_UNCHECKED_CHECKED,
    ANIM_UNCHECKED_INDETERMINATE,
    ANIM_CHECKED_UNCHECKED,
    ANIM_CHECKED_INDETERMINATE,
    ANIM_INDETERMINATE_CHECKED,
    ANIM_INDETERMINATE_UNCHECKED,
  } = cssClasses

  switch (oldState) {
    case TRANSITION_STATE_INIT:
      if (newState === TRANSITION_STATE_UNCHECKED) {
        return ''
      }
      return newState === TRANSITION_STATE_CHECKED
        ? ANIM_INDETERMINATE_CHECKED
        : ANIM_INDETERMINATE_UNCHECKED
    case TRANSITION_STATE_UNCHECKED:
      return newState === TRANSITION_STATE_CHECKED
        ? ANIM_UNCHECKED_CHECKED
        : ANIM_UNCHECKED_INDETERMINATE
    case TRANSITION_STATE_CHECKED:
      return newState === TRANSITION_STATE_UNCHECKED
        ? ANIM_CHECKED_UNCHECKED
        : ANIM_CHECKED_INDETERMINATE
    default:
      // TRANSITION_STATE_INDETERMINATE
      return newState === TRANSITION_STATE_CHECKED
        ? ANIM_INDETERMINATE_CHECKED
        : ANIM_INDETERMINATE_UNCHECKED
  }
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  className,
  style = {},
  disabled,
  indeterminate,
  name,
  onChange,
  nativeControlId,
  children,
  unbounded,
  ...otherProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [classList, setClassList] = useState<string[]>([])

  const addClass = useCallback(
    (cls: string) => {
      setClassList(prevList => [...prevList, cls])
    },
    [setClassList]
  )

  const removeClass = useCallback(
    (cls: string) => {
      setClassList(prevList => prevList.filter(c => c !== cls))
    },
    [setClassList]
  )

  const [rippleStyle, rippleClassName] = useRipple({
    surfaceRef: containerRef,
    activatorRef: inputRef,
    disabled,
    unbounded,
  })

  const checkState = useMemo(() => {
    const {
      TRANSITION_STATE_INDETERMINATE,
      TRANSITION_STATE_CHECKED,
      TRANSITION_STATE_UNCHECKED,
    } = strings

    if (indeterminate) {
      return TRANSITION_STATE_INDETERMINATE
    }
    return checked ? TRANSITION_STATE_CHECKED : TRANSITION_STATE_UNCHECKED
  }, [checked, indeterminate])

  const prevCheckState = useRef<string>()

  useEffect(() => {
    prevCheckState.current = checkState
  }, [checkState])

  const animationClassRef = useRef('')

  const enableAnimationEndHandlerRef = useRef(false)

  const animationLatchTimerRef = useRef(null)

  useEffect(() => {
    //updateAriaChecked_()

    const { TRANSITION_STATE_UNCHECKED } = strings
    const { SELECTED } = cssClasses
    if (checkState === TRANSITION_STATE_UNCHECKED) {
      removeClass(SELECTED)
    } else {
      addClass(SELECTED)
    }

    // Check to ensure that there isn't a previously existing animation class, in case for example
    // the user interacted with the checkbox before the animation was finished.
    if (animationClassRef.current.length > 0) {
      clearTimeout(animationLatchTimerRef.current)
      removeClass(animationClassRef.current)
    }

    animationClassRef.current = getTransitionAnimationClass(
      prevCheckState.current,
      checkState
    )

    if (animationClassRef.current.length > 0) {
      addClass(animationClassRef.current)
      enableAnimationEndHandlerRef.current = true
    }
  }, [addClass, checkState, removeClass])

  const classes = classNames(
    className,
    classList,
    rippleClassName,
    cssClasses.ROOT,
    {
      [cssClasses.DISABLED]: disabled,
    }
  )

  const handleAnimationEnd = () => {
    if (!enableAnimationEndHandlerRef.current) {
      return
    }

    animationLatchTimerRef.current = setTimeout(() => {
      removeClass(animationClassRef.current)
      enableAnimationEndHandlerRef.current = false
    }, numbers.ANIM_END_LATCH_MS)
  }

  return (
    <div
      className={classes}
      onAnimationEnd={handleAnimationEnd}
      ref={containerRef}
      style={{
        ...style,
        ...rippleStyle,
      }}
      {...otherProps}
    >
      <input
        type="checkbox"
        className={cssClasses.NATIVE_CONTROL}
        id={nativeControlId}
        checked={checked}
        disabled={disabled}
        aria-checked={checked.toString() as ('true' | 'false')}
        name={name}
        onChange={onChange}
        ref={inputRef}
      />
      <div className={cssClasses.BACKGROUND}>
        <svg
          className={cssClasses.CHECKMARK}
          viewBox="0 0 24 24"
          focusable="false"
        >
          <path
            className={cssClasses.CHECKMARK_PATH}
            fill="none"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
          />
        </svg>
        <div className={cssClasses.MIXEDMARK} />
      </div>
    </div>
  )
}

export default Checkbox
