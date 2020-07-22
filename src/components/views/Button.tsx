import classnames from 'classnames'
import React, { forwardRef, useState } from 'react'

type Props = {
  variation?: 'outline' | 'primary' | 'secondary' | 'plain'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = '', variation = 'plain', children, disabled, ...props },
  inputRef
) {
  const classes = classnames(
    className,
    'relative rounded h-10 py-1 px-2 outline-reset overflow-hidden',
    {
      'font-medium': variation !== 'plain',
      'font-normal': variation === 'plain',
      'border-0': variation !== 'outline',
      'border-2 border-primary': variation === 'outline',
      'text-action-primary':
        (variation === 'plain' || variation === 'outline') && !disabled,
      'text-on-primary': variation === 'primary' && !disabled,
      'text-disabled': disabled,
      'bg-primary': variation === 'primary' && !disabled,
      'bg-secondary': variation === 'secondary' && !disabled,
      'bg-transparent': variation === 'outline' && !disabled,
      'bg-disabled': disabled,
    }
  )

  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (evt) => {
    setFocused(true)
    props.onFocus?.(evt)
  }
  const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (evt) => {
    setFocused(false)
    props.onBlur?.(evt)
  }

  const handleMouseEnter: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    setHovered(true)
    props.onMouseEnter?.(evt)
  }
  const handleMouseLeave: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    setHovered(false)
    props.onMouseLeave?.(evt)
  }

  return (
    <button
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes}
      ref={inputRef}
      disabled={disabled}
    >
      <div className="relative z-0 flex items-center justify-center text-base">
        {children}
      </div>
      <div
        className={classnames(
          'absolute top-0 left-0 right-0 bottom-0 transition-opacity ease-in-out duration-200 opacity-0',
          {
            'opacity-0': !hovered || !focused,
            'opacity-12': (hovered || focused) && variation !== 'secondary',
            'opacity-100': (hovered || focused) && variation === 'secondary',
            hidden:
              (!hovered || !focused) &&
              variation !== 'plain' &&
              variation !== 'outline' &&
              variation !== 'secondary',
            'bg-primary':
              (variation === 'plain' || variation === 'outline') && !disabled,
            'bg-hover-overlay': variation === 'secondary',
          }
        )}
      />
    </button>
  )
})

export default Button
