import { Trans } from '@lingui/macro'

import Button from '../components/views/Button'
import { Body1, Headline4, Overline } from '../components/views/Typography'

export const errorFallback = ({
  error,
  componentStack,
}: {
  error: Error
  componentStack: string
}) => {
  return (
    <div className="flex flex-col justify-center items-center py-8 min-h-screen bg-background">
      <Headline4 className="text-primary">
        <Trans>Something went wrong</Trans>
      </Headline4>
      <Body1 className="mt-1 text-primary">
        <Trans>Please, try reloading the page</Trans>
      </Body1>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        <Trans>Refresh</Trans>
      </Button>
      {process.env.NODE_ENV === 'development' && error && (
        <>
          <Overline className="mt-4 text-primary">
            Error message: "{error.message}"
          </Overline>
          <pre className="text-primary">{componentStack}</pre>
        </>
      )}
    </div>
  )
}
