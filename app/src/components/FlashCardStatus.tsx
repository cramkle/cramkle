import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import React from 'react'

import styles from './FlashCardStatus.css'

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
    throw new Error('FlashCardStatus rendering failed.')
  }

  return (
    <div
      className={classnames('inline-flex items-center h2 f6 br4 ph2', {
        [styles.new]: status === CardStatus.NEW,
        [styles.learning]: status === CardStatus.LEARNING,
        [styles.due]: status === CardStatus.DUE,
      })}
      role="row"
    >
      <span className="dib mh1">{message}</span>
    </div>
  )
}

export default FlashCardStatus
