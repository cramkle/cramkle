import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import { FlashCardStatus } from '../globalTypes'
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
  [FlashCardStatus.NEW]: 'success',
  [FlashCardStatus.LEARNING]: 'emphasis',
} as const

const FlashCardStatusChip: React.FC<Props> = ({ status }) => {
  const { i18n } = useLingui()

  let message = null

  if (status === FlashCardStatus.NEW) {
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
    <Chip type={chipTypeByStatus[status]} inverted>
      {message}
    </Chip>
  )
}

export default FlashCardStatusChip
