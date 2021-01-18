import { Trans } from '@lingui/macro'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Body1, Headline5 } from '../views/Typography'

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-0 min-h-screen">
      <Headline5 className="font-bold text-center sm:text-left">
        <Trans>We couldn't find the page you requested</Trans>
      </Headline5>
      <Body1 className="mt-2 sm:mt-1 text-center sm:text-left">
        <Trans>This link may be broken or the typed URL is incorrect.</Trans>
      </Body1>
      <Link className="mt-8 sm:mt-4 text-primary" to="/">
        <Trans>Go to Home</Trans>
      </Link>
    </div>
  )
}

export default NotFoundPage
