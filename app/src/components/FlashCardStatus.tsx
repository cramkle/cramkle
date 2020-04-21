import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import { Chip } from './views/Chip'

enum FlashCardStatus {
  DUE = 'DUE',
  LEARNING = 'LEARNING',
  NEW = 'NEW',
}

interface Props {
  status: FlashCardStatus
}

const messages = {
  new: t`New`,
  learning: t`Learning`,
  due: t`Due`,
}

const chipTypeByStatus = {
  [FlashCardStatus.DUE]: 'emphasis',
  [FlashCardStatus.NEW]: 'success',
  [FlashCardStatus.LEARNING]: undefined as undefined,
} as const

const FlashCardStatusChip: React.FC<Props> = ({ status }) => {
  const { i18n } = useLingui()

  let message = null

  if (status === FlashCardStatus.NEW) {
    message = i18n._(messages.new)
  } else if (status === FlashCardStatus.LEARNING) {
    message = i18n._(messages.learning)
  } else if (status === FlashCardStatus.DUE) {
    message = i18n._(messages.due)
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
