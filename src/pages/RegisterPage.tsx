import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from '../assets/logo-white.svg'
import RegisterForm from '../components/forms/RegisterForm'

const RegisterPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col min-h-screen p-4 justify-center items-center bg-primary-dark text-on-primary">
      <Helmet>
        <title>{i18n._(t`Register`)}</title>
        <meta
          name="description"
          content={i18n._(
            t`Create your account today and start studying for free!`
          )}
        />
      </Helmet>

      <Logo className="w-16 mb-8" />

      <RegisterForm />

      <span className="mt-4">
        <Trans>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-on-primary">
            Log In
          </Link>
        </Trans>
      </span>
    </div>
  )
}

export default RegisterPage
