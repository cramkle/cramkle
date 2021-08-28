import { Trans } from '@lingui/macro'

import { Button } from '../components/views/Button'
import { Body1, Headline4, Overline } from '../components/views/Typography'

export const errorFallback = ({
  error,
  componentStack,
}: {
  error: Error
  componentStack: string | null
}) => {
  return (
    <div className="flex flex-col justify-center items-center py-8 min-h-screen bg-background  bg-opacity-background">
      <Headline4 className="text-txt text-opacity-text-primary">
        <Trans>Something went wrong</Trans>
      </Headline4>
      <Body1 className="mt-1 text-txt text-opacity-text-primary">
        <Trans>Please, try reloading the page</Trans>
      </Body1>
      <Button
        id="refresh-button"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        <Trans>Refresh</Trans>
      </Button>
      {process.env.NODE_ENV === 'development' && error && (
        <>
          <Overline className="mt-4 text-txt text-opacity-text-primary">
            Error message: "{error.message}"
          </Overline>
          <pre className="text-txt text-opacity-text-primary">
            {componentStack ?? error.stack}
          </pre>
        </>
      )}
    </div>
  )
}
