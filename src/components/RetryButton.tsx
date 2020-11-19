import classnames from 'classnames'
import * as React from 'react'

import RetryIcon from './icons/RetryIcon'

const RetryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  return (
    <button
      {...props}
      className={classnames(
        props.className,
        'flex items-center text-red-1 text-sm rounded hover:bg-hover-overlay border border-red-1 px-2 py-1'
      )}
    >
      <RetryIcon className="mr-2 h-4 w-4 flex-shrink-0" />
      {props.children}
    </button>
  )
}

export default RetryButton
