import * as React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Switch, withRouter } from 'react-router'
import { Route } from 'react-router-dom'

import ScreenLoader from './components/ScreenLoader'
import { isFetching } from './selectors/user'

import TopBarRoute from './components/routes/TopBarRoute'
import GuestRoute from './components/routes/GuestRoute'
import UserRoute from './components/routes/UserRoute'

import LandingPage from './components/pages/LandingPage'
import DashboardPage from './components/pages/DashboardPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import AboutPage from './components/pages/AboutPage'
import NotFoundPage from './components/pages/NotFoundPage'

interface AppProps {
  fetchingUser: boolean
}

const App: React.StatelessComponent<AppProps> = ({ fetchingUser }) => (
  <React.Fragment>
    <Helmet defaultTitle="Cramkle" titleTemplate="%s - Cramkle" />
    <ScreenLoader loading={fetchingUser}>
      <Switch>
        <GuestRoute
          component={LandingPage}
          path="/"
          exact
        />
        <TopBarRoute
          RouteComponent={UserRoute}
          component={DashboardPage}
          path="/dashboard"
          exact
        />
        <GuestRoute component={RegisterPage} path="/register" exact />
        <GuestRoute component={LoginPage} path="/login" exact />
        <Route component={AboutPage} path="/about" exact />
        <Route component={NotFoundPage} />
      </Switch>
    </ScreenLoader>
  </React.Fragment>
)

const mapStateToProps = state => ({
  fetchingUser: isFetching(state),
})

export default withRouter(connect(mapStateToProps)(App))
