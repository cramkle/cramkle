import VisuallyHidden from '@reach/visually-hidden'
import classnames from 'classnames'
import React, { useState } from 'react'

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
        'text-disabled': disabled,
        'text-primary': !disabled,
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
          'text-disabled': !checked && disabled,
          'text-action-primary-disabled': checked && disabled,
          'text-primary': !checked && !disabled,
          'text-action-primary': checked && !disabled,
        })}
        viewBox="0 0 60 32"
        width="60"
        height="32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {focused && (
          <rect
            x="1"
            y="1"
            width="58"
            height="30"
            rx="15"
            stroke="var(--primary)"
            strokeWidth="2"
          />
        )}
        <rect
          className="transition-color ease-in-out duration-200"
          x={checked ? 3 : 4}
          y={checked ? 3 : 4}
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
          cx="16"
          cy="16"
          r="9"
          fill={checked ? 'var(--on-primary)' : 'currentColor'}
        />
      </svg>
      {children}
    </label>
  )
}
