import { Trans } from '@lingui/macro'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import Button from 'views/Button'
import Icon from 'views/Icon'

const BackButton: React.FunctionComponent = () => {
  const history = useHistory()
  const handleClick = useCallback(() => {
    history.goBack()
  }, [history])

  return (
    <Button
      className="mb3 mt2-ns"
      icon={<Icon icon="arrow_back" aria-hidden="true" />}
      onClick={handleClick}
      dense
    >
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
