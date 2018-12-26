import React, { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'

import ShellRoute from './components/routes/ShellRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'
import Mobile from './components/MobileContext'
import { useMobileListener } from './hooks/useMobile'
import client from './utils/apolloClient'

import './theme.scss'

const AboutPage = lazy(() => import('./components/pages/AboutPage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const IndexPage = lazy(() => import('./components/pages/IndexPage'))
const LoginPage = lazy(() => import('./components/pages/LoginPage'))
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'))
const RegisterPage = lazy(() => import('./components/pages/RegisterPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))

const App: React.FunctionComponent<{}> = () => {
  const isMobile = useMobileListener()

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  )
}

export default hot(withRouter(App))
