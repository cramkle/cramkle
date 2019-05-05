import { Trans, t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import { Snackbar } from '@material/react-snackbar'
import React from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import logoInvertedUrl from '../../assets/logo--inverted.svg'
import LoginForm from '../forms/LoginForm'

const LoginPage: React.FunctionComponent<RouteComponentProps> = ({
  location,
}) => {
  return (
    <I18n>
      {({ i18n }) => (
        <div className="flex flex-column min-vh-100 w-100 pa3 items-center justify-center bg-primary c-on-primary">
          <Helmet>
            <title>{i18n._(t`Login`)}</title>
          </Helmet>

          <img className="w3 h3 mb4" src={logoInvertedUrl} alt="" />

          <LoginForm />

          <span className="mt3">
            <Trans>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="b c-on-primary">
                Sign Up
              </Link>
            </Trans>
          </span>

          {location.state && location.state.newUser && (
            <Snackbar
              message={i18n._(t`Account created successfully`)}
              actionText="dismiss"
              leading
            />
          )}
        </div>
      )}
    </I18n>
  )
}

export default LoginPage
