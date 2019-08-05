import {
  MDCCheckboxAdapter,
  MDCCheckboxFoundation,
  cssClasses,
} from '@material/checkbox'
import { MDCRippleFoundation } from '@material/ripple'
import classNames from 'classnames'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useRipple } from './Ripple'
import useClassList from '../../hooks/useClassList'

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

export interface CheckboxRef {
  ripple: MDCRippleFoundation
}

const Checkbox: React.RefForwardingComponent<CheckboxRef, CheckboxProps> = (
  {
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
  },
  ref
) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { classList, addClass, removeClass } = useClassList()
  const foundationRef = useRef<MDCCheckboxFoundation>(null)
  const [inputProps, setInputProps] = useState<
    React.InputHTMLAttributes<HTMLInputElement>
  >({})

  const { rippleStyle, rippleClasses, rippleFoundation } = useRipple({
    surfaceRef: containerRef,
    activatorRef: inputRef,
    disabled,
    unbounded: true,
  })

  useImperativeHandle(ref, () => ({
    ripple: rippleFoundation,
  }))

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

    return () => {
      foundationRef.current.destroy()
    }
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
    rippleClasses,
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

export default React.forwardRef(Checkbox)
