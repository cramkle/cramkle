import classnames from 'classnames'
import * as React from 'react'

import styles from './LoadingBar.css'

export const LoadingBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <div
      {...props}
      className={classnames(props.className, 'w-full h-1 overflow-hidden')}
      role="progressbar"
    >
      <div className="bg-surface absolute w-full h-full" />
      <div
        className={classnames(
          styles.indeterminateAnimation,
          'absolute h-full w-full origin-top-left transition-none'
        )}
      >
        <span className="inline-block h-full w-full absolute bg-yellow-1" />
      </div>
    </div>
  )
}
