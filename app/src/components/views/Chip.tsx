import classnames from 'classnames'
import React from 'react'

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'emphasis'
  inverted?: boolean
}

export const Chip: React.FC<ChipProps> = ({
  type = undefined,
  inverted = false,
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
        className={classnames('inline-block mx-1', {
          [`text-${type}`]: inverted && type !== undefined,
          [`text-on-${type}`]: !inverted && type !== undefined,
          'text-on-surface': type === undefined,
        })}
      >
        {children}
      </span>
      <div
        className={classnames('absolute top-0 left-0 right-0 bottom-0 -z-1', {
          'opacity-08': inverted && type !== undefined,
          [`bg-${type}`]: type !== undefined,
          'bg-muted': type === undefined,
        })}
      />
    </div>
  )
}
