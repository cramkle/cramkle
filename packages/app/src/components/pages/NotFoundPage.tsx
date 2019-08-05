import { Trans } from '@lingui/macro'
import { Body1, Headline5 } from '@material/react-typography'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <div className="flex flex-column items-center justify-center ph3 ph0-ns min-vh-100">
      <Headline5 className="b tc tl-ns">
        <Trans>We couldn't find the page you requested</Trans>
      </Headline5>
      <Body1 className="mt2 mt1-ns tc tl-ns">
        <Trans>This link may be broken or the typed URL is incorrect.</Trans>
      </Body1>
      <Link className="mt4 mt3-ns" to="/">
        <Trans>Go to Home</Trans>
      </Link>
    </div>
  )
}

export default NotFoundPage
