import classnames from 'classnames'
import type { ButtonHTMLAttributes, FC } from 'react'

import { LoadingDots } from './LoadingDots'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export const PlaceOrderButton: FC<Props> = ({
  children,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classnames(
        className,
        'h-12 py-2 px-6 rounded font-medium flex items-center justify-center',
        {
          'bg-primary text-on-primary hover:bg-primary-light focus:bg-primary-light':
            !loading && !disabled,
          'bg-primary-dark text-on-primary text-opacity-text-secondary': loading,
          'bg-disabled bg-opacity-disabled text-txt text-opacity-text-disabled':
            !loading && disabled,
        }
      )}
      {...props}
      disabled={disabled}
    >
      {loading && <LoadingDots className="h-4" />}
      <span className={classnames({ 'ml-2': loading })}>{children}</span>
    </button>
  )
}
