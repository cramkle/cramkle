import classnames from 'classnames'
import React from 'react'

interface Props {
  className?: string
  horizontal?: boolean
}

const Divider: React.FC<Props> = ({ horizontal = true, className = '' }) => {
  const Component = horizontal ? 'hr' : 'div'

  return (
    <Component
      className={classnames(className, 'br-0 bb-0 border-outline', {
        'bl-0 border-t w-full': horizontal,
        'bt-0 lg:border h-full': !horizontal,
      })}
    />
  )
}

export default Divider
