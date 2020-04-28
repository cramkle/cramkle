import { Trans } from '@lingui/macro'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import Button from './views/Button'
import Icon from './views/Icon'

interface Props {
  to?: string
}

const BackButton: React.FC<Props> = ({ to }) => {
  const history = useHistory()
  const handleClick = useCallback(() => {
    if (to) {
      history.push(to)
    } else {
      history.goBack()
    }
  }, [to, history])

  return (
    <Button
      className="mb-4 sm:mt-2"
      icon={<Icon icon="arrow_back" aria-hidden="true" />}
      onClick={handleClick}
      dense
    >
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
