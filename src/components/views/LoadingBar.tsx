import classnames from 'classnames'
import React from 'react'

import styles from './LoadingBar.css'

export const LoadingBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <div
      {...props}
      className={classnames(props.className, 'w-full h-1 overflow-hidden')}
      style={{
        transform: 'translateZ(0)',
        transition: 'opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)',
        ...props.style,
      }}
      role="progressbar"
    >
      <div className="bg-gray-1 absolute w-full h-full" />
      <div
        className={classnames(
          styles.indeterminateAnimation,
          'absolute h-full w-full origin-top-left transition-none'
        )}
        style={{ transform: 'scaleX(1)' }}
      >
        <span className="inline-block h-full w-full absolute bg-yellow-1" />
      </div>
    </div>
  )
}
