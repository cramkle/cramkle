import { Trans } from '@lingui/macro'
import { Body1, Headline4, Overline } from '@material/react-typography'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'

import Button from 'views/Button'

const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack }) => {
  return (
    <div className="flex flex-column justify-center items-center pv4 min-vh-100">
      <Headline4>
        <Trans>Something went wrong</Trans>
      </Headline4>
      <Body1 className="mt1">
        <Trans>Please, try reloading the page</Trans>
      </Body1>
      <Button className="mt3" onClick={() => window.location.reload()}>
        <Trans>Refresh</Trans>
      </Button>
      {process.env.NODE_ENV === 'development' && (
        <>
          <Overline className="mt3">Error message: "{error.message}"</Overline>
          <pre>{componentStack}</pre>
        </>
      )}
    </div>
  )
}

export default ErrorFallback
