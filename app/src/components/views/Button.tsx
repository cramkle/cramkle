import classnames from 'classnames'
import React, { forwardRef } from 'react'

type Props = {
  variation?: 'outline' | 'primary' | 'secondary' | 'plain'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = '', variation = 'plain', children, disabled, ...props },
  inputRef
) {
  const classes = classnames(
    className,
    'relative rounded h-10 py-1 px-2 focus:shadow-outline overflow-hidden',
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

  return (
    <button {...props} className={classes} ref={inputRef} disabled={disabled}>
      <div className="relative z-0 flex items-center justify-center text-base">
        {children}
      </div>
      <div
        className={classnames(
          'absolute top-0 left-0 right-0 bottom-0 transition-opacity ease-in-out duration-200 opacity-0',
          {
            hidden: variation !== 'plain' && variation !== 'outline',
            'bg-primary hover:opacity-12':
              (variation === 'plain' || variation === 'outline') && !disabled,
          }
        )}
      />
    </button>
  )
})

export default Button
