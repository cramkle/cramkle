import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import LoginForm from '../forms/LoginForm'
import { Button } from '../views/Button'
import { Card, CardContent } from '../views/Card'

const LoginPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary-dark text-on-primary">
      <Helmet>
        <title>{i18n._(t`Login`)}</title>
        <meta
          name="description"
          content={i18n._(t`Login to your account to study your decks`)}
        />
      </Helmet>

      <Logo className="w-16 mb-8" />

      <Card className="w-full max-w-md">
        <CardContent>
          <LoginForm />

          <div className="flex items-center my-2">
            <div className="w-full border-t border-divider" />
            <span className="mx-2">
              <Trans>or</Trans>
            </span>
            <div className="w-full border-t border-divider" />
          </div>

          <form action="/_c/auth/anonymousLogin" method="post">
            <input
              type="hidden"
              name="zoneInfo"
              value={Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
            <input type="hidden" name="locale" value={i18n.locale} />
            <Button className="w-full" type="submit" variation="secondary">
              <Trans>Continue without account</Trans>
            </Button>
          </form>
        </CardContent>
      </Card>

      <span className="mt-4">
        <Trans>
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-on-primary">
            Sign Up
          </Link>
        </Trans>
      </span>
    </div>
  )
}

export default LoginPage
