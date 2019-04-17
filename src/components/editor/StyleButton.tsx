import cx from 'classnames'
import React, { memo } from 'react'

export interface Style {
  label: string
  style: string
}

const StyleButton: React.FunctionComponent<{
  onToggle: (s: string) => void
  label: string
  style: string
  active: boolean
}> = ({ onToggle, label, style, active }) => {
  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const className = cx('pointer mr3 pv1 dib', {
    'c-primary': active,
  })

  return (
    <span
      role="button"
      tabIndex={0}
      className={className}
      onMouseDown={handleToggle}
    >
      {label}
    </span>
  )
}

export default memo(StyleButton)
