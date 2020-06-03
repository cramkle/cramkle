import { Trans } from '@lingui/macro'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'

import Button from './views/Button'
import { Body1, Headline4, Overline } from './views/Typography'

const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack }) => {
  return (
    <div className="flex flex-col justify-center items-center py-8 min-h-screen">
      <Headline4>
        <Trans>Something went wrong</Trans>
      </Headline4>
      <Body1 className="mt-1">
        <Trans>Please, try reloading the page</Trans>
      </Body1>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        <Trans>Refresh</Trans>
      </Button>
      {process.env.NODE_ENV === 'development' && error && (
        <>
          <Overline className="mt-4">Error message: "{error.message}"</Overline>
          <pre>{componentStack}</pre>
        </>
      )}
    </div>
  )
}

export default ErrorFallback
