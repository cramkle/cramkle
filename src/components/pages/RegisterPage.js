import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import RegisterForm from '../forms/RegisterForm'
import './RegisterPage.scss'

const RegisterPage = () => {
  return (
    <div className="register-page flex flex-column h-100 justify-center items-center">
      <RegisterForm />
      <span className="register-page__login-text">
        Already have an account? <Link to="/login" className="b">Log In</Link>
      </span>
      <Helmet>
        <title>Register</title>
      </Helmet>
    </div>
  )
}

export default RegisterPage
