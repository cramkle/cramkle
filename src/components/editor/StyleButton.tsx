import type { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { memo, useRef } from 'react'
import * as React from 'react'

import useHover from '../../hooks/useHover'
import { Tooltip } from '../views/Tooltip'

export interface Style {
  label: MessageDescriptor | string
  style: string
  icon?: React.ReactElement
}

interface Props extends Style {
  active: boolean
  onToggle: (style: string) => void
  className?: string
  hidden?: boolean
}

const StyleButton: React.VFC<Props> = ({
  onToggle,
  label,
  style,
  active,
  icon,
  className = '',
  hidden = false,
}) => {
  const { i18n } = useLingui()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const hovering = useHover(buttonRef)

  const classes = classnames(
    className,
    'flex-shrink-0 text-txt text-opacity-text-primary relative cursor-pointer mr-2 border-0 border-none rounded-sm flex items-center text-center outline-none p-1 overflow-hidden',
    {
      'text-primary text-opacity-100': active,
    }
  )

  const translatedLabel = i18n._(label)

  const button = (
    <button
      className={classes}
      onMouseDown={handleToggle}
      ref={buttonRef}
      aria-label={translatedLabel}
    >
      {icon ? icon : translatedLabel}
      <div
        className={classnames('absolute top-0 left-0 w-full h-full', {
          'hidden': !active && !hovering,
          'bg-primary': active,
          'opacity-25': active && !hovering,
          'opacity-50': active && hovering,
          'bg-hover-overlay': hovering && !active,
        })}
      />
    </button>
  )

  return icon ? (
    <Tooltip className={classnames({ hidden })} label={translatedLabel}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}

export default memo(StyleButton)
