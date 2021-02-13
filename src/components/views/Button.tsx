import classnames from 'classnames'
import { forwardRef } from 'react'
import * as React from 'react'

type Props = {
  variation?: 'outline' | 'primary' | 'secondary' | 'plain'
  size?: 'normal' | 'small'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = '',
    variation = 'plain',
    size = 'normal',
    children,
    disabled,
    ...props
  },
  inputRef
) {
  const classes = classnames(
    className,
    'relative rounded py-1 px-4 outline-reset overflow-hidden',
    'transition-opacity ease-in-out duration-200',
    {
      'h-10': size === 'normal',
      'h-8': size === 'small',
      'font-medium': variation !== 'plain',
      'font-normal': variation === 'plain',
      'border-0': variation !== 'outline',
      'border-2': variation === 'outline',
      'border-primary': variation === 'outline' && !disabled,
      'border-disabled border-opacity-disabled':
        variation === 'outline' && disabled,
      'text-primary':
        (variation === 'plain' || variation === 'outline') && !disabled,
      'text-on-primary': variation === 'primary' && !disabled,
      'text-txt text-opacity-text-primary':
        variation === 'secondary' && !disabled,
      'text-txt text-opacity-text-disabled': disabled,
      'bg-primary':
        (variation === 'primary' ||
          variation === 'plain' ||
          variation === 'outline') &&
        !disabled,
      'hover:bg-hover-overlay focus:bg-hover-overlay hover:bg-opacity-100 focus:bg-opacity-100':
        (variation === 'primary' || variation === 'secondary') && !disabled,
      'bg-opacity-12 hover:bg-opacity-20 focus:bg-opacity-20':
        (variation === 'plain' || variation === 'outline') && !disabled,
      'bg-secondary bg-opacity-secondary':
        variation === 'secondary' && !disabled,
      'bg-transparent': variation === 'outline' && !disabled,
      'bg-disabled bg-opacity-disabled': disabled,
    }
  )

  return (
    <button {...props} className={classes} ref={inputRef} disabled={disabled}>
      <div
        className={classnames('relative z-0 flex items-center justify-center', {
          'text-base': size === 'normal',
          'text-sm': size === 'small',
        })}
      >
        {children}
      </div>
    </button>
  )
})

export default Button
