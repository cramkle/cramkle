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
  let colorName = color as string

  if (colorName !== 'primary' && colorName !== undefined) {
    colorName = `${colorName}-1`
  }

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
          [`text-${colorName}`]:
            inverted && (color !== undefined || color !== 'primary'),
          'text-action-primary': inverted && color === 'primary',
          'overflow-hidden whitespace-no-wrap': truncated,
        })}
      >
        {children}
      </span>
      <div
        className={classNames('absolute top-0 left-0 right-0 bottom-0 -z-1', {
          'opacity-08': inverted && color !== undefined,
          [`bg-${colorName}`]: color !== undefined,
          'bg-secondary': color === undefined,
        })}
      />
    </div>
  )
}
