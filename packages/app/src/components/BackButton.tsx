import Icon from '@material/react-material-icon'
import { Trans } from '@lingui/macro'
import React, { useCallback } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import Button from './views/Button'

const BackButton: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const handleClick = useCallback(() => {
    history.goBack()
  }, [history])

  return (
    <Button
      className="mb2 mt2-ns"
      icon={<Icon icon="arrow_back" aria-hidden="true" />}
      onClick={handleClick}
      dense
    >
      <Trans>Go back</Trans>
    </Button>
  )
}

export default withRouter(BackButton)
