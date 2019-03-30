import React, { lazy } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'

import AboutPage from './components/pages/AboutPage'
import IndexPage from './components/pages/IndexPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ShellRoute from './components/routes/ShellRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'
import Mobile from './components/MobileContext'
import { useMobileListener } from './hooks/useMobile'
import client from './utils/apolloClient'

import './theme.scss'

const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))

const App: React.FunctionComponent<{}> = () => {
  const isMobile = useMobileListener()

  return (
    <ApolloProvider client={client}>
      <Mobile.Provider value={isMobile}>
        <Helmet defaultTitle="Cramkle" titleTemplate="%s - Cramkle" />
        <Switch>
          <Route
            component={IndexPage}
            path={['/', '/decks', '/templates']}
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
  )
}

export default hot(withRouter(App))
