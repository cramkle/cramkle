import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Snackbar } from '@material/react-snackbar'

import logoInvertedUrl from '../../assets/logo--inverted.svg'
import LoginForm from '../forms/LoginForm'

const LoginPage: React.FunctionComponent<RouteComponentProps> = ({
  location,
}) => {
  return (
    <div className="flex flex-column min-vh-100 w-100 pa3 items-center justify-center bg-primary c-on-primary">
      <Helmet>
        <title>Login</title>
      </Helmet>

      <img className="w3 h3 mb4" src={logoInvertedUrl} alt="" />

      <LoginForm />

      <span className="mt3">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="b c-on-primary">
          Sign Up
        </Link>
      </span>

      {location.state && location.state.newUser && (
        <Snackbar
          message="Account created successfully"
          actionText="dismiss"
          leading
        />
      )}
    </div>
  )
}

export default LoginPage
