import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'

import { FlashCardStatus } from '../globalTypes'
import { useTheme } from './Theme'
import type { ChipProps } from './views/Chip'
import { Chip } from './views/Chip'

interface Props {
  status: FlashCardStatus
}

const messages = {
  new: t`New`,
  learning: t`Learning`,
  review: t`Review`,
}

const chipTypeByStatus = {
  [FlashCardStatus.REVIEW]: undefined as undefined,
  [FlashCardStatus.NEW]: 'green',
  [FlashCardStatus.LEARNING]: 'violet',
} as const

const FlashCardStatusChip: React.FC<
  Props & Omit<ChipProps, 'type' | 'inverted'>
> = ({ status, children, ...props }) => {
  const { theme } = useTheme()
  const { i18n } = useLingui()

  let message = null

  if (children) {
    message = children
  } else if (status === FlashCardStatus.NEW) {
    message = i18n._(messages.new)
  } else if (status === FlashCardStatus.LEARNING) {
    message = i18n._(messages.learning)
  } else if (status === FlashCardStatus.REVIEW) {
    message = i18n._(messages.review)
  } else {
    throw new Error(
      `FlashCardStatus rendering failed: invalid status "${status}"`
    )
  }

  return (
    <Chip
      {...props}
      color={chipTypeByStatus[status]}
      inverted={theme === 'light'}
    >
      {message}
    </Chip>
  )
}

export default FlashCardStatusChip
