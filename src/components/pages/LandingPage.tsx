import React from 'react'
import { Link } from 'react-router-dom'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar'
import { Headline2, Headline4 } from '@material/react-typography'

import logoUrl from '../../assets/logo.svg'
import RegisterForm from '../forms/RegisterForm'

const LandingPage: React.FunctionComponent = () => (
  <>
    <TopAppBar className="landing-bar" fixed>
      <TopAppBarRow>
        <TopAppBarSection align="start">
          <TopAppBarIcon>
            <img style={{ height: 24, width: 24 }} src={logoUrl} alt="" />
          </TopAppBarIcon>
          <TopAppBarTitle>Cramkle</TopAppBarTitle>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
    <TopAppBarFixedAdjust>
      <div className="bg-primary c-on-primary min-vh-100 w-100">
        <div className="flex flex-column flex-row-ns justify-around items-center mh2 mh5-l pv5 pv6-ns">
          <div
            className="flex flex-wrap pv4 pv0-ns w-100"
            style={{ maxWidth: 450 }}
          >
            <Headline2 className="f2 f1-ns b lh-title">
              Make sure your knowledge will last
            </Headline2>
            <Headline4 className="f5 f3-ns mt3 lh-title">
              Optimize your knowledge retention with this effective study
              method.
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
      </div>
    </TopAppBarFixedAdjust>
  </>
)

export default LandingPage
