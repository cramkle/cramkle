import classnames from 'classnames'
import * as React from 'react'

interface Props {
  className?: string
  horizontal?: boolean
}

export const Divider: React.FC<Props> = ({
  horizontal = true,
  className = '',
}) => {
  const Component = horizontal ? 'hr' : 'div'

  return (
    <Component
      className={classnames(
        className,
        'border-r-0 bb-0 border-divider border-opacity-divider',
        {
          'bl-0 border-t w-full': horizontal,
          'bt-0 lg:border h-full': !horizontal,
        }
      )}
    />
  )
}
