import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import RegisterForm from '../forms/RegisterForm'

const RegisterPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col min-h-screen p-4 justify-center items-center bg-primary text-on-primary">
      <Helmet>
        <title>{i18n._(t`Register`)}</title>
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
