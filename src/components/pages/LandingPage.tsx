import * as React from 'react'
import { Link } from 'react-router-dom'

import RegisterForm from '../forms/RegisterForm'
import './LandingPage.scss'

const LandingPage : React.StatelessComponent<{}> = () => (
  <div className="landing__jumbo">
    <div>
      <h1 className="mdc-typography--headline2 landing__app-title">
        Cramkle
      </h1>
      <h2 className="mdc-typography--headline4 landing__moto">
        Make sure your knowledge will last
      </h2>
    </div>
    <div className="landing__register-container">
      <RegisterForm title="Sign up now!" />

      <span className="landing__login-text">
        Already have an account? <Link to="/login">Log In</Link>
      </span>
    </div>
  </div>
)

export default LandingPage
