import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import RegisterForm from '../forms/RegisterForm'
import './RegisterPage.scss'

const RegisterPage: React.FunctionComponent = () => {
  return (
    <div className="flex flex-column vh-100 pa3 justify-center items-center bg-primary c-on-primary">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <RegisterForm />
      <span className="mt3">
        Already have an account?{' '}
        <Link to="/login" className="b c-on-primary">
          Log In
        </Link>
      </span>
    </div>
  )
}

export default RegisterPage
