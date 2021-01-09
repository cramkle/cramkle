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
        }
      )}
      role="row"
    >
      <span
        style={{ textOverflow: truncated ? 'ellipsis' : 'initial' }}
        className={classNames('inline-block mx-1', {
          '__dark-mode': !inverted && color !== undefined,
          'text-primary': !inverted && color !== 'primary',
          'text-on-primary': !inverted && color === 'primary',
          'text-red-1': inverted && color === 'red',
          'text-green-1': inverted && color === 'green',
          'text-violet-1': inverted && color === 'violet',
          'text-action-primary': inverted && color === 'primary',
          'overflow-hidden whitespace-nowrap': truncated,
        })}
      >
        {children}
      </span>
      <div
        className={classNames('absolute top-0 left-0 right-0 bottom-0 -z-1', {
          'opacity-08': inverted && color !== undefined,
          'bg-green-1': color === 'green',
          'bg-red-1': color === 'red',
          'bg-violet-1': color === 'violet',
          'bg-secondary': color === undefined,
        })}
      />
    </div>
  )
}
