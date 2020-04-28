import classnames from 'classnames'
import React from 'react'

import styles from './Chip.css'

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
        'relative inline-flex items-center h-8 text-sm rounded-full px-2 overflow-hidden',
        styles.chip,
        {
          [styles.inverted]: inverted,
          [styles.success]: type === 'success',
          [styles.error]: type === 'error',
          [styles.emphasis]: type === 'emphasis',
          [styles.default]: type === undefined,
        }
      )}
      role="row"
    >
      <span className={classnames('inline-block mx-1', styles.text)}>
        {children}
      </span>
    </div>
  )
}
