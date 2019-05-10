import { MessageDescriptor } from '@lingui/core'
import { I18n } from '@lingui/react'
import cx from 'classnames'
import React, { memo, useRef } from 'react'

import { useControlledTabIndex } from '../TabController'

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
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const className = cx('pointer mr3 pv1 dib bn', {
    'c-primary': active,
  })

  const { tabIndex, onKeyDown } = useControlledTabIndex(buttonRef, style)

  return (
    <I18n>
      {({ i18n }) => (
        <button
          className={className}
          onClick={handleToggle}
          ref={buttonRef}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
        >
          {i18n._(label)}
        </button>
      )}
    </I18n>
  )
}

export default memo(StyleButton)
