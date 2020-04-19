import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ReactComponent as Logo } from 'assets/logo-white.svg'
import RegisterForm from 'forms/RegisterForm'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const RegisterPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-column min-vh-100 pa3 justify-center items-center bg-primary c-on-primary">
      <Helmet>
        <title>{i18n._(t`Register`)}</title>
      </Helmet>

      <Logo className="w3 mb4" />

      <RegisterForm />

      <span className="mt3">
        <Trans>
          Already have an account?{' '}
          <Link to="/login" className="b c-on-primary">
            Log In
          </Link>
        </Trans>
      </span>
    </div>
  )
}

export default RegisterPage
