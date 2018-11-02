import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { Switch, withRouter } from 'react-router'
import { Route } from 'react-router-dom'

import ScreenLoader from './components/ScreenLoader'

import TopBarRoute from './components/routes/TopBarRoute'
// import GuestRoute from './components/routes/GuestRoute'
// import UserRoute from './components/routes/UserRoute'

import LandingPage from './components/pages/LandingPage'
import DashboardPage from './components/pages/DashboardPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import AboutPage from './components/pages/AboutPage'
import NotFoundPage from './components/pages/NotFoundPage'

const App = ({ fetchingUser }) => (
  <Fragment>
    <Helmet defaultTitle="Cramkle" titleTemplate="%s - Cramkle" />
    <ScreenLoader loading={fetchingUser}>
      <Switch>
        <Route
          component={LandingPage}
          path="/"
          exact
        />
        <TopBarRoute
          component={DashboardPage}
          path="/dashboard"
          exact
        />
        <Route component={RegisterPage} path="/register" exact />
        <Route component={LoginPage} path="/login" exact />
        <Route component={AboutPage} path="/about" exact />
        <Route component={NotFoundPage} />
      </Switch>
    </ScreenLoader>
  </Fragment>
)

export default withRouter(App)
