import Button from '@material/react-button'
import Icon from '@material/react-material-icon'
import React, { useCallback } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

const BackButton: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const handleClick = useCallback(() => {
    history.goBack()
  }, [history])

  return (
    <Button
      className="mv2"
      icon={<Icon icon="arrow_back" />}
      onClick={handleClick}
      dense
    >
      Go back
    </Button>
  )
}

export default withRouter(BackButton)
