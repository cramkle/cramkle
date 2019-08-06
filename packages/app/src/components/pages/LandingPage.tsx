import { Trans, t } from '@lingui/macro'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar'
import { Headline2, Headline4 } from '@material/react-typography'
import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

import Button from 'views/Button'
import Footer from 'components/Footer'
import RegisterForm from 'forms/RegisterForm'
import { ReactComponent as Logo } from 'assets/logo.svg'
import bgUrl from 'assets/landing-bg.svg'

const LandingPage: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => (
  <>
    <TopAppBar fixed>
      <TopAppBarRow>
        <TopAppBarSection align="start">
          <TopAppBarIcon>
            <Logo height="24" width="24" />
          </TopAppBarIcon>
          <TopAppBarTitle>Cramkle</TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection align="end">
          <Button unelevated onClick={() => history.push('/register')}>
            <Trans>Sign Up</Trans>
          </Button>
          <Button onClick={() => history.push('/login')} className="ml2">
            <Trans>Login</Trans>
          </Button>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
    <TopAppBarFixedAdjust>
      <div
        className="flex bg-primary c-on-primary min-vh-100 w-100"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="flex flex-column flex-row-ns justify-around items-center w-100 mh2 mh5-l pv5 pv6-ns">
          <div
            className="flex flex-wrap pv4 pv0-ns w-100"
            style={{ maxWidth: 450 }}
          >
            <Headline2 className="f2 f1-ns b lh-title">
              <Trans>Make sure your knowledge will last</Trans>
            </Headline2>
            <Headline4 className="f5 f3-ns mt3 lh-title">
              <Trans>
                Optimize your knowledge retention with this effective study
                method.
              </Trans>
            </Headline4>
          </div>
          <div
            className="inline-flex flex-column items-center w-100"
            style={{ maxWidth: 450 }}
          >
            <RegisterForm title={t`Sign up now!`} />

            <span className="landing__login-text mt3">
              <Trans>
                Already have an account?{' '}
                <Link to="/login" className="b c-on-primary">
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

export default withRouter(LandingPage)
