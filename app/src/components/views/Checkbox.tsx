import {
  CustomCheckboxContainer,
  CustomCheckboxContainerProps,
  CustomCheckboxInput,
} from '@reach/checkbox'
import classnames from 'classnames'
import React, { ReactNode, forwardRef } from 'react'

import styles from './Checkbox.css'
import { Label } from './Input'

export type CheckboxProps = Omit<CustomCheckboxContainerProps, 'children'> & {
  name?: string
  value?: string | number | string[]
  children?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      children,
      checked,
      defaultChecked,
      disabled,
      onChange,
      name,
      value,
      ...props
    },
    ref
  ) {
    let checkboxElement = (
      <CustomCheckboxContainer
        {...props}
        className={classnames(
          className,
          styles.checkboxContainer,
          'group w-auto h-auto flex items-center relative bg-surface p-3',
          { 'mr-3': !!children, 'mr-0': !children }
        )}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
      >
        <div
          className={classnames(
            styles.focusRing,
            'z-0 hidden bg-yellow opacity-12 rounded-full w-full h-full absolute top-0 left-0 right-0'
          )}
        />
        <CustomCheckboxInput
          className="cursor-pointer"
          name={name}
          value={value}
          ref={ref}
        />
        <div
          className={classnames(
            'w-5 h-5 border-2 rounded-sm z-10 pointer-events-none',
            'transition-colors ease-in-out duration-200',
            {
              'bg-yellow border-yellow': checked,
              'bg-transparent border-gray-2': !checked,
            }
          )}
          aria-hidden
        >
          <svg
            className={classnames('transition-none', {
              'text-on-primary': checked,
              'text-on-surface': !checked,
            })}
            viewBox="0 0 24 24"
          >
            {checked === true && (
              <path
                d="M1.73,12.91 8.1,19.28 22.79,4.59"
                fill="none"
                stroke="currentColor"
                strokeWidth="3px"
              />
            )}
            {checked === 'mixed' && (
              <path
                d="M1.73,12.91 22.79,12.91"
                fill="none"
                stroke="currentColor"
                strokeWidth="3px"
              />
            )}
          </svg>
        </div>
      </CustomCheckboxContainer>
    )

    if (children) {
      checkboxElement = (
        <Label text={children} checkbox>
          {checkboxElement}
        </Label>
      )
    }

    return checkboxElement
  }
)
