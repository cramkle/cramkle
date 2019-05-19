import { Trans } from '@lingui/macro'
import { Headline5, Body1 } from '@material/react-typography'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <div className="flex flex-column items-center justify-center min-vh-100">
      <Headline5 className="b">
        <Trans>We couldn't find the page you requested</Trans>
      </Headline5>
      <Body1 className="mt1">
        <Trans>This link may be broken or the typed URL is incorrect.</Trans>
      </Body1>
      <Link className="mt3" to="/">
        <Trans>Go to Home</Trans>
      </Link>
    </div>
  )
}

export default NotFoundPage
