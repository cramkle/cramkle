import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import logoInvertedUrl from '../../assets/logo--inverted.svg'
import RegisterForm from '../forms/RegisterForm'

const RegisterPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-column min-vh-100 pa3 justify-center items-center bg-primary c-on-primary">
      <Helmet>
        <title>{i18n._(t`Register`)}</title>
      </Helmet>

      <img className="w3 h3 mb4" src={logoInvertedUrl} alt="" />

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
