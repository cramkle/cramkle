import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import { Chip } from './views/Chip'

enum CardStatus {
  DUE = 'DUE',
  LEARNING = 'LEARNING',
  NEW = 'NEW',
}
interface Props {
  status: CardStatus
}

const messages = {
  new: t`New`,
  learning: t`Learning`,
  due: t`Due`,
}

const chipTypeByStatus = {
  [CardStatus.DUE]: 'emphasis',
  [CardStatus.NEW]: 'success',
  [CardStatus.LEARNING]: undefined as undefined,
} as const

const FlashCardStatus: React.FC<Props> = ({ status }) => {
  const { i18n } = useLingui()

  let message = null

  if (status === CardStatus.NEW) {
    message = i18n._(messages.new)
  } else if (status === CardStatus.LEARNING) {
    message = i18n._(messages.learning)
  } else if (status === CardStatus.DUE) {
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

export default FlashCardStatus
