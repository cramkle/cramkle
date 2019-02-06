import React from 'react'
import { Link } from 'react-router-dom'
import { Headline2, Headline4 } from '@material/react-typography'

import RegisterForm from '../forms/RegisterForm'

const LandingPage = () => (
  <div className="bg-primary c-on-primary flex flex-column flex-row-l pa3 justify-around items-center vh-100 w-100">
    <div>
      <Headline2 className="b">Cramkle</Headline2>
      <Headline4 className="mv4 mv0">
        Make sure your knowledge will last
      </Headline4>
    </div>
    <div
      className="inline-flex flex-column items-center w-100"
      style={{ maxWidth: 450 }}
    >
      <RegisterForm title="Sign up now!" />

      <span className="landing__login-text mt3">
        Already have an account?{' '}
        <Link to="/login" className="b c-on-primary">
          Log In
        </Link>
      </span>
    </div>
  </div>
)

export default LandingPage
