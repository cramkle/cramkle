import React, { lazy } from 'react'
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
import { MobileProvider } from './components/MobileContext'
import client from './utils/apolloClient'

import './theme.scss'

const HomePage = lazy(() => import('./components/pages/HomePage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const ModelPage = lazy(() => import('./components/pages/ModelPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))

const App: React.FunctionComponent<{}> = () => (
  <ApolloProvider client={client}>
    <MobileProvider>
      <Helmet
        defaultTitle="Cramkle"
        titleTemplate="%s - Cramkle"
        meta={[
          {
            name: 'application-name',
            content: 'Cramkle',
          },
          {
            name: 'description',
            content: 'Make sure your knowledge will last',
          },
          {
            name: 'keywords',
            content: 'flashcards,anki,srs,spaced repetition',
          },
        ]}
      />
      <Switch>
        <GuestRoute component={LandingPage} path="/" exact />
        <ShellRoute
          component={HomePage}
          RouteComponent={UserRoute}
          path={['/home', '/decks', '/models']}
          exact
        />
        <ShellRoute
          component={DeckPage}
          RouteComponent={UserRoute}
          path="/d/:slug"
          exact
        />
        <ShellRoute
          component={ModelPage}
          RouteComponent={UserRoute}
          path="/m/:id"
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
    </MobileProvider>
  </ApolloProvider>
)

export default hot(withRouter(App))
