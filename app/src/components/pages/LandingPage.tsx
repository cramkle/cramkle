import { Trans, t } from '@lingui/macro'
import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import bgUrl from '../../assets/landing-bg.svg'
import { ReactComponent as Logo } from '../../assets/logo.svg'
import Footer from '../Footer'
import RegisterForm from '../forms/RegisterForm'
import Button from '../views/Button'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '../views/TopAppBar'
import { Headline2, Headline4 } from '../views/Typography'

const LandingPage: React.FunctionComponent = () => {
  const history = useHistory()

  return (
    <>
      <TopAppBar fixed>
        <TopAppBarRow>
          <TopAppBarSection align="start">
            <TopAppBarIcon>
              <Logo width={24} />
            </TopAppBarIcon>
            <TopAppBarTitle>Cramkle</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection align="end">
            <Button unelevated onClick={() => history.push('/register')}>
              <Trans>Sign Up</Trans>
            </Button>
            <Button onClick={() => history.push('/login')} className="ml-2">
              <Trans>Login</Trans>
            </Button>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust>
        <div
          className="flex bg-primary text-on-primary min-h-screen w-full"
          style={{ backgroundImage: `url(${bgUrl})` }}
        >
          <div className="flex flex-col sm:flex-row justify-around items-center w-full mx-2 lg:mx-16 py-16 sm:py-32">
            <div
              className="flex flex-wrap py-8 sm:py-0 w-full"
              style={{ maxWidth: 450 }}
            >
              <Headline2 className="text-4xl sm:text-5xl font-bold leading-tight">
                <Trans>Make sure your knowledge will last</Trans>
              </Headline2>
              <Headline4 className="text-base sm:text-2xl mt-4 leading-tight">
                <Trans>
                  Optimize your knowledge retention with this effective study
                  method.
                </Trans>
              </Headline4>
            </div>
            <div
              className="inline-flex flex-col items-center w-full"
              style={{ maxWidth: 450 }}
            >
              <RegisterForm title={t`Sign up now!`} />

              <span className="landing__login-text mt-4">
                <Trans>
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-on-primary">
                    Log In
                  </Link>
                </Trans>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </TopAppBarFixedAdjust>
    </>
  )
}

export default LandingPage
