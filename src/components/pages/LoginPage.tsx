import * as React from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import LoginForm from '../forms/LoginForm'
import './LoginPage.scss'

export default function LoginPage() {
  return (
    <div className="login-page">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginForm />

      <span className="login-page__sign-up-text">
        Don&apos;t have an account? <Link to="/register">Sign Up</Link>
      </span>
    </div>
  )
}
