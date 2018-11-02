import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { Switch, withRouter } from 'react-router'
import { Route } from 'react-router-dom'

import ScreenLoader from './components/ScreenLoader'

import TopBarRoute from './components/routes/TopBarRoute'
// import GuestRoute from './components/routes/GuestRoute'
// import UserRoute from './components/routes/UserRoute'

import AboutPage from './components/pages/AboutPage'
import DashboardPage from './components/pages/DashboardPage'
import DeckPage from './components/pages/DeckPage'
import LandingPage from './components/pages/LandingPage'
import LoginPage from './components/pages/LoginPage'
import NotFoundPage from './components/pages/NotFoundPage'
import RegisterPage from './components/pages/RegisterPage'

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
        <TopBarRoute
          component={DeckPage}
          path="/d/:slug"
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
