import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import LoginForm from '../forms/LoginForm'

const LoginPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-column min-vh-100 w-100 pa3 items-center justify-center bg-primary c-on-primary">
      <Helmet>
        <title>{i18n._(t`Login`)}</title>
      </Helmet>

      <Logo className="w3 h3 mb4" />

      <LoginForm />

      <span className="mt3">
        <Trans>
          Don't have an account?{' '}
          <Link to="/register" className="b c-on-primary">
            Sign Up
          </Link>
        </Trans>
      </span>
    </div>
  )
}

export default LoginPage
