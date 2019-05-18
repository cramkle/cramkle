import { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import Icon from '@material/react-material-icon'
import cx from 'classnames'
import React, { memo, useRef } from 'react'
import { useControlledTabIndex } from 'react-tab-controller'

import styles from './StyleButton.css'

export interface Style {
  label: MessageDescriptor
  style: string
  icon?: string
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

  const className = cx(
    styles.button,
    'relative pointer mr2 pv1 dib bn bg-surface flex items-center',
    {
      'c-primary': active,
      [styles.buttonSelected]: active,
    }
  )

  const { tabIndex, onKeyDown } = useControlledTabIndex(buttonRef, style)

  const translatedLabel = i18n._(label)

  return (
    <button
      className={className}
      onClick={handleToggle}
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
