import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'

import TopBarRoute from './components/routes/TopBarRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'
import AboutPage from './components/pages/AboutPage'
import DeckPage from './components/pages/DeckPage'
import IndexPage from './components/pages/IndexPage'
import LoginPage from './components/pages/LoginPage'
import NotFoundPage from './components/pages/NotFoundPage'
import RegisterPage from './components/pages/RegisterPage'
import MarketplacePage from './components/pages/MarketplacePage'
import StatisticsPage from './components/pages/StatisticsPage'
import SettingsPage from './components/pages/SettingsPage'
import Mobile from './components/MobileContext'
import { useMobileListener } from './hooks/useMobile'
import client from './utils/apolloClient'

import './theme.scss'

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
          <TopBarRoute
            component={DeckPage}
            RouteComponent={UserRoute}
            path="/d/:slug"
            exact
          />
          <TopBarRoute
            component={MarketplacePage}
            RouteComponent={UserRoute}
            path="/marketplace"
            exact
          />
          <TopBarRoute
            component={StatisticsPage}
            RouteComponent={UserRoute}
            path="/statistics"
            exact
          />
          <TopBarRoute
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
