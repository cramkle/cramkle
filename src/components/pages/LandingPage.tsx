import { Trans, t } from '@lingui/macro'
import * as React from 'react'
import { Link } from 'react-router-dom'

import bgUrl from '../../assets/landing-bg.svg'
import { ReactComponent as Logo } from '../../assets/logo.svg'
import AppName from '../AppName'
import Footer from '../Footer'
import RegisterForm from '../forms/RegisterForm'
import { Header, HeaderContent, HeaderSection } from '../views/Header'
import { Headline2, Headline4 } from '../views/Typography'

const LandingPage: React.FunctionComponent = () => {
  return (
    <>
      <Header>
        <HeaderContent>
          <HeaderSection>
            <div className="flex items-center pl-1">
              <Logo width="32" />
              <AppName className="ml-2" />
            </div>
          </HeaderSection>
          <HeaderSection align="end">
            <Link
              to="/login"
              className="text-txt text-opacity-text-primary hover:bg-secondary hover:bg-opacity-secondary rounded py-1 px-2 h-10 flex items-center"
            >
              <Trans>Login</Trans>
            </Link>
            <Link
              className="text-on-primary bg-primary rounded py-1 px-2 h-10 flex items-center ml-2"
              to="/register"
            >
              <Trans>Sign Up</Trans>
            </Link>
          </HeaderSection>
        </HeaderContent>
      </Header>
      <div
        className="flex bg-background-primary text-on-primary min-h-screen w-full"
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

            <span className="mt-4">
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
    </>
  )
}

export default LandingPage
