import * as React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import RegisterForm from '../forms/RegisterForm'
import './RegisterPage.scss'

export default function RegisterPage() {
  return (
    <div className="register-page">
      <RegisterForm />
      <span className="register-page__login-text">
        Already have an account? <Link to="/login">Log In</Link>
      </span>
      <Helmet>
        <title>Register</title>
      </Helmet>
    </div>
  )
}
