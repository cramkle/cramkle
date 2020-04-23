import { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import React, { memo, useRef } from 'react'
import { useControlledTabIndex } from 'react-tab-controller'
import Icon from 'views/Icon'
import { IconTypes } from 'views/IconTypes'

import styles from './StyleButton.css'

export interface Style {
  label: MessageDescriptor | string
  style: string
  icon?: IconTypes
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
  icon,
}) => {
  const { i18n } = useLingui()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const className = classNames(
    styles.button,
    'mdc-typography mdc-ripple-surface bg-surface relative pointer mr2 pv1 dib bn br1 flex items-center',
    {
      'c-primary mdc-ripple-surface--primary': active,
      [styles.buttonSelected]: active,
    }
  )

  const { tabIndex, onKeyDown } = useControlledTabIndex(buttonRef, style)

  const translatedLabel = i18n._(label)

  return (
    <button
      className={className}
      onMouseDown={handleToggle}
      ref={buttonRef}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-label={translatedLabel}
    >
      {icon ? <Icon className={styles.icon} icon={icon} /> : translatedLabel}
    </button>
  )
}

export default memo(StyleButton)
