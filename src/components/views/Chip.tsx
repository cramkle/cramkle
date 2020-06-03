import classnames from 'classnames'
import React from 'react'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'green' | 'red' | 'violet'
  inverted?: boolean
  truncated?: boolean
}

export const Chip: React.FC<ChipProps> = ({
  color = undefined,
  inverted = false,
  truncated = false,
  className = '',
  children,
}) => {
  return (
    <div
      className={classnames(
        className,
        'relative z-0 inline-flex items-center h-8 text-sm rounded-full px-2 overflow-hidden'
      )}
      role="row"
    >
      <span
        style={{ textOverflow: truncated ? 'ellipsis' : 'initial' }}
        className={classnames('inline-block mx-1 text-primary', {
          [`text-${color}-1`]: inverted && color !== undefined,
          'overflow-hidden whitespace-no-wrap': truncated,
        })}
      >
        {children}
      </span>
      <div
        className={classnames('absolute top-0 left-0 right-0 bottom-0 -z-1', {
          'opacity-08': inverted && color !== undefined,
          [`bg-${color}-1`]: color !== undefined,
          'bg-secondary': color === undefined,
        })}
      />
    </div>
  )
}
