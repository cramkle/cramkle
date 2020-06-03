import classnames from 'classnames'
import React from 'react'

const AppName: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => {
  return (
    <span
      {...props}
      className={classnames(
        props.className,
        'text-lg font-medium tracking-wide'
      )}
    >
      Cramkle
    </span>
  )
}

export default AppName
