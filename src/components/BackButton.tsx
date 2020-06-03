import { Trans } from '@lingui/macro'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import BackArrowIcon from './icons/BackArrowIcon'
import Button from './views/Button'

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
    <Button className="mb-4 sm:mt-2" onClick={handleClick}>
      <BackArrowIcon className="mr-2" />
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
