import React, { lazy, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'

import AboutPage from './components/pages/AboutPage'
import LandingPage from './components/pages/LandingPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ShellRoute from './components/routes/ShellRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'
import Mobile from './components/MobileContext'
import useWindowSize from './hooks/useWindowSize'
import client from './utils/apolloClient'

import './theme.scss'

const HomePage = lazy(() => import('./components/pages/HomePage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))

const App: React.FunctionComponent<{}> = () => {
  // TODO: use a different aproach to detect mobile device
  const { width } = useWindowSize()

  const isMobile = width < 1024

  return useMemo(
    () => (
      <ApolloProvider client={client}>
        <Mobile.Provider value={isMobile}>
          <Helmet defaultTitle="Cramkle" titleTemplate="%s - Cramkle" />
          <Switch>
            <GuestRoute component={LandingPage} path="/" exact />
            <ShellRoute
              component={HomePage}
              RouteComponent={UserRoute}
              path={['/home', '/decks', '/templates']}
              exact
            />
            <ShellRoute
              component={DeckPage}
              RouteComponent={UserRoute}
              path="/d/:slug"
              exact
            />
            <ShellRoute
              component={MarketplacePage}
              RouteComponent={UserRoute}
              path="/marketplace"
              exact
            />
            <ShellRoute
              component={StatisticsPage}
              RouteComponent={UserRoute}
              path="/statistics"
              exact
            />
            <ShellRoute
              component={SettingsPage}
              RouteComponent={UserRoute}
              path="/settings"
              exact
            />
            <GuestRoute component={RegisterPage} path="/register" exact />
            <GuestRoute component={LoginPage} path="/login" exact />
            <Route component={AboutPage} path="/about" exact />
            <Route component={NotFoundPage} />
          </Switch>
        </Mobile.Provider>
      </ApolloProvider>
    ),
    [isMobile]
  )
}

export default hot(withRouter(App))
