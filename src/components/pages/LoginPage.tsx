import * as React from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import LoginForm from '../forms/LoginForm'
import './LoginPage.scss'

export default function LoginPage() {
  return (
    <div className="login-page flex flex-column h-100 w-100 items-center justify-center">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginForm />

      <span className="login-page__sign-up-text mt2">
        Don&apos;t have an account? <Link to="/register" className="b">Sign Up</Link>
      </span>
    </div>
  )
}
