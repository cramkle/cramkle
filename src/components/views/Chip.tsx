import classNames from 'classnames'
import * as React from 'react'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'primary' | 'green' | 'red' | 'violet'
  size?: 'normal' | 'small'
  inverted?: boolean
  truncated?: boolean
}

export const Chip: React.FC<ChipProps> = ({
  color = undefined,
  inverted = false,
  truncated = false,
  className = '',
  size = 'normal',
  children,
}) => {
  return (
    <div
      className={classNames(
        className,
        'relative z-0 inline-flex items-center rounded-full overflow-hidden',
        {
          'px-2 h-8 text-sm': size === 'normal',
          'px-1 h-6 text-xs': size === 'small',
          'bg-opacity-08': inverted && color !== undefined,
          'bg-green-1': color === 'green',
          'bg-red-1': color === 'red',
          'bg-violet-1': color === 'violet',
          'bg-primary': color === 'primary',
          'bg-secondary bg-opacity-secondary': color === undefined,
        }
      )}
      role="row"
    >
      <span
        style={{ textOverflow: truncated ? 'ellipsis' : 'initial' }}
        className={classNames('inline-block mx-1', {
          'text-txt text-opacity-text-primary':
            !inverted && color === undefined,
          'text-always-white':
            !inverted && color !== 'primary' && color !== undefined,
          'text-on-primary': !inverted && color === 'primary',
          'text-red-1': inverted && color === 'red',
          'text-green-1': inverted && color === 'green',
          'text-violet-1': inverted && color === 'violet',
          'text-primary': inverted && color === 'primary',
          'overflow-hidden whitespace-nowrap': truncated,
        })}
      >
        {children}
      </span>
    </div>
  )
}
