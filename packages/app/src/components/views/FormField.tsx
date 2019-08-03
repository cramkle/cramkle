import {
  MDCFormFieldFoundation,
  MDCFormFieldAdapter,
  cssClasses,
} from '@material/form-field'
import { MDCRippleFoundation } from '@material/ripple'
import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'

interface InputRef {
  ripple: MDCRippleFoundation
}

interface Props {
  label: React.ReactNode
  input: React.ReactElement<React.RefAttributes<InputRef>>
  inputId?: string
  alignEnd?: boolean
}

const FormField: React.FC<Props> = ({
  label,
  alignEnd = false,
  input,
  inputId,
}) => {
  const classes = classNames(cssClasses.ROOT, {
    'mdc-form-field--align-end': alignEnd,
  })
  const inputRef = useRef<InputRef>(null)

  const labelRef = useRef<HTMLLabelElement>(null)
  const foundationRef = useRef<MDCFormFieldFoundation>(null)

  useEffect(() => {
    const adapter: MDCFormFieldAdapter = {
      activateInputRipple: () => {
        inputRef.current.ripple.activate()
      },
      deactivateInputRipple: () => {
        inputRef.current.ripple.deactivate()
      },
      registerInteractionHandler: (type, handler) => {
        labelRef.current.addEventListener(type, handler)
      },
      deregisterInteractionHandler: (type, handler) => {
        labelRef.current.removeEventListener(type, handler)
      },
    }

    foundationRef.current = new MDCFormFieldFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [])

  return (
    <div className={classes}>
      {React.cloneElement(input, {
        ref: inputRef,
      })}
      <label ref={labelRef} htmlFor={inputId}>
        {label}
      </label>
    </div>
  )
}

export default FormField
