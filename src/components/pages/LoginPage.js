import React from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import LoginForm from '../forms/LoginForm'
import './LoginPage.scss'

const LoginPage = () => {
  return (
    <div className="flex flex-column h-100 w-100 items-center justify-center bg-primary c-on-primary">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginForm />

      <span className="mt3">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="b c-on-primary">Sign Up</Link>
      </span>
    </div>
  )
}

export default LoginPage
