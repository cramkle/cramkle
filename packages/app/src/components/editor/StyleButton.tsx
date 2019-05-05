import { MessageDescriptor } from '@lingui/core'
import { I18n } from '@lingui/react'
import cx from 'classnames'
import React, { memo } from 'react'

export interface Style {
  label: MessageDescriptor
  style: string
}

interface Props extends Style {
  active: boolean
  onToggle: (style: string) => void
}

const StyleButton: React.FunctionComponent<Props> = ({
  onToggle,
  label,
  style,
  active,
}) => {
  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const className = cx('pointer mr3 pv1 dib', {
    'c-primary': active,
  })

  return (
    <I18n>
      {({ i18n }) => (
        <span
          role="button"
          tabIndex={0}
          className={className}
          onMouseDown={handleToggle}
        >
          {i18n._(label)}
        </span>
      )}
    </I18n>
  )
}

export default memo(StyleButton)
