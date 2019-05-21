import { Trans } from '@lingui/macro'
import Button from '@material/react-button'
import { Headline4, Body1 } from '@material/react-typography'
import React from 'react'

const ErrorFallback = () => {
  return (
    <div className="flex flex-column justify-center items-center min-vh-100">
      <Headline4>
        <Trans>Something went wrong</Trans>
      </Headline4>
      <Body1 className="mt1">
        <Trans>Please, try reloading the page</Trans>
      </Body1>
      <Button className="mt3" onClick={() => window.location.reload()}>
        <Trans>Refresh</Trans>
      </Button>
    </div>
  )
}

export default ErrorFallback
