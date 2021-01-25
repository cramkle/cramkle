import VisuallyHidden from '@reach/visually-hidden'
import classnames from 'classnames'
import { useState } from 'react'
import * as React from 'react'

export const Switch: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & {
    reverse?: boolean
  }
> = ({
  children,
  className,
  checked: checkedProps,
  onChange,
  onFocus,
  onBlur,
  disabled,
  reverse = false,
  ...props
}) => {
  const [checkedState, setChecked] = useState(false)

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setChecked(evt.target.checked)

    onChange?.(evt)
  }

  const [focused, setFocused] = useState(false)

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (evt) => {
    setFocused(true)
    onFocus?.(evt)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (evt) => {
    setFocused(false)
    onBlur?.(evt)
  }

  const checked = checkedProps ?? checkedState

  return (
    <label
      className={classnames(className, 'flex items-center', {
        'flex-row-reverse': reverse,
        'text-txt text-opacity-text-disabled': disabled,
        'text-txt text-opacity-text-primary': !disabled,
      })}
    >
      <VisuallyHidden>
        <input
          {...props}
          checked={checked}
          disabled={disabled}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </VisuallyHidden>

      <svg
        className={classnames({
          'mr-3': !reverse,
          'ml-3': reverse,
          'text-txt text-opacity-text-disabled': !checked && disabled,
          'text-primary-disabled': checked && disabled,
          'text-txt text-opacity-text-primary': !checked && !disabled,
          'text-primary': checked && !disabled,
        })}
        viewBox="0 0 62 34"
        width="62"
        height="34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {focused && (
          <rect
            x="1"
            y="1"
            width="60"
            height="32"
            rx="16"
            stroke="var(--primary)"
            strokeWidth="2"
          />
        )}
        <rect
          className="transition-color ease-in-out duration-200"
          x={checked ? 4 : 5}
          y={checked ? 4 : 5}
          width={checked ? '54' : '52'}
          height={checked ? '26' : '24'}
          rx={checked ? '13' : '12'}
          fill={checked ? 'currentColor' : undefined}
          stroke="currentColor"
          strokeWidth={checked ? '0' : '2'}
        />

        <circle
          className={classnames(
            'transition-transform ease-in-out duration-200',
            { 'text-surface': checked }
          )}
          style={{ transform: `translateX(${checked ? '28px' : '0px'})` }}
          cx="17"
          cy="17"
          r="9"
          fill={checked ? 'var(--on-primary)' : 'currentColor'}
        />
      </svg>
      {children}
    </label>
  )
}
