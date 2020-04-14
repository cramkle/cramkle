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
      className={classnames(className, 'br-0 bb-0 b--outline', {
        'bl-0 bt w-100': horizontal,
        'bt-0 bl h-100': !horizontal,
      })}
    />
  )
}

export default Divider
