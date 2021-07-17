import type * as Polymorphic from '@reach/utils/polymorphic'
import classnames from 'classnames'
import { forwardRef } from 'react'

type Props = {
  variation?: 'outline' | 'primary' | 'secondary' | 'plain'
  size?: 'normal' | 'small' | 'large'
  disabled?: boolean
}

export const Button = forwardRef(function Button(
  {
    className = '',
    variation = 'plain',
    size = 'normal',
    children,
    disabled,
    as: As = 'button',
    ...props
  },
  inputRef
) {
  const classes = classnames(
    className,
    'relative inline-block outline-reset overflow-hidden tracking-normal font-medium',
    'transition-opacity ease-in-out duration-200',
    {
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled,
      'py-2 px-6 md:py-4 md:px-10': size === 'large',
      'py-1 px-6': size === 'normal' || size === 'small',
      'rounded': size === 'normal' || size === 'small',
      'rounded-lg': size === 'large',
      'h-14 md:h-16': size === 'large',
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
      'bg-primary hover:bg-primary-light focus:bg-primary-light':
        (variation === 'primary' ||
          variation === 'plain' ||
          variation === 'outline') &&
        !disabled,
      'bg-opacity-12 hover:bg-opacity-20 focus:bg-opacity-20':
        (variation === 'plain' || variation === 'outline') && !disabled,
      'bg-secondary bg-opacity-secondary hover:bg-opacity-100 focus:bg-opacity-100 hover:bg-secondary-dark focus:bg-secondary-dark':
        variation === 'secondary' && !disabled,
      'bg-transparent': variation === 'outline' && !disabled,
      'bg-disabled bg-opacity-disabled': disabled,
    }
  )

  return (
    <As {...props} className={classes} ref={inputRef} disabled={disabled}>
      <div
        className={classnames('relative z-0 flex items-center justify-center', {
          'text-xl': size === 'large',
          'text-base': size === 'normal',
          'text-sm': size === 'small',
        })}
      >
        {children}
      </div>
    </As>
  )
}) as Polymorphic.ForwardRefComponent<'button', Props>
