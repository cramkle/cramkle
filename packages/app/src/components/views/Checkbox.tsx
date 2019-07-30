import classNames from 'classnames'
import React, { useState, useRef, useEffect, useCallback } from 'react'

import {
  cssClasses,
  MDCCheckboxFoundation,
  MDCCheckboxAdapter,
} from '@material/checkbox'
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
  value?: string
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  className,
  style = {},
  disabled,
  indeterminate,
  name,
  onChange,
  value,
  nativeControlId,
  children,
  ...otherProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [classList, setClassList] = useState<string[]>([])
  const foundationRef = useRef<MDCCheckboxFoundation>(null)
  const [inputProps, setInputProps] = useState<
    React.InputHTMLAttributes<HTMLInputElement>
  >({})

  const addClass = useCallback((cls: string) => {
    setClassList(prevList => [...prevList, cls])
  }, [])

  const removeClass = useCallback((cls: string) => {
    setClassList(prevList => prevList.filter(c => c !== cls))
  }, [])

  const [rippleStyle, rippleClassName] = useRipple({
    surfaceRef: containerRef,
    activatorRef: inputRef,
    disabled,
    unbounded: true,
  })

  useEffect(() => {
    inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const checkedRef = useRef(checked)

  useEffect(() => {
    checkedRef.current = checked
  }, [checked])

  const indeterminateRef = useRef(indeterminate)

  useEffect(() => {
    indeterminateRef.current = indeterminate
  }, [indeterminate])

  useEffect(() => {
    const adapter: MDCCheckboxAdapter = {
      addClass: cls => addClass(cls),
      removeClass: cls => removeClass(cls),
      forceLayout: () => null,
      hasNativeControl: () => true,
      isAttachedToDOM: () => true,
      isChecked: () => checkedRef.current,
      isIndeterminate: () => indeterminateRef.current,
      setNativeControlAttr: (attr, value) => {
        setInputProps(prevProps => {
          return {
            ...prevProps,
            [attr]: value,
          }
        })
      },
      removeNativeControlAttr: attr => {
        setInputProps(prevProps => {
          const updatedProps = Object.assign({}, prevProps)

          delete updatedProps[
            attr as keyof React.HTMLAttributes<HTMLInputElement>
          ]

          return updatedProps
        })
      },
      setNativeControlDisabled: disabled => {
        setInputProps(prevProps => {
          const updatedProps = Object.assign({}, prevProps)

          if (disabled) {
            updatedProps.disabled = disabled
          } else {
            delete updatedProps.disabled
          }

          return updatedProps
        })
      },
    }

    foundationRef.current = new MDCCheckboxFoundation(adapter)
    foundationRef.current.init()
  }, [addClass, removeClass])

  useEffect(() => {
    foundationRef.current.setDisabled(disabled)
  }, [disabled])

  useEffect(() => {
    foundationRef.current.handleChange()
  }, [checked, indeterminate])

  const handleAnimationEnd = () => {
    foundationRef.current.handleAnimationEnd()
  }

  const classes = classNames(
    className,
    classList,
    rippleClassName,
    cssClasses.ROOT
  )

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
        {...inputProps}
        type="checkbox"
        className={cssClasses.NATIVE_CONTROL}
        id={nativeControlId}
        checked={checked}
        name={name}
        onChange={onChange}
        value={value}
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
