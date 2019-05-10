import { I18nProvider } from '@lingui/react'
import React, { lazy } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader/root'
import Cookies from 'universal-cookie'

import AboutPage from './components/pages/AboutPage'
import LandingPage from './components/pages/LandingPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ShellRoute from './components/routes/ShellRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'
import { HintsProvider } from './components/HintsContext'
import en from './locales/en/messages'
import pt from './locales/pt/messages'
import client from './utils/apolloClient'

import './theme.global.scss'

const HomePage = lazy(() => import('./components/pages/HomePage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const ModelPage = lazy(() => import('./components/pages/ModelPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const AddModelPage = lazy(() => import('./components/pages/AddModelPage'))

let language: string

if (window.requestLanguage) {
  language = window.requestLanguage
} else {
  const cookies = new Cookies()
  language = cookies.get('language') || 'en'
}

const App: React.FunctionComponent<{}> = () => (
  <I18nProvider language={language} catalogs={{ en, pt }}>
    <ApolloProvider client={client}>
      <HintsProvider>
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
            component={AddModelPage}
            RouteComponent={UserRoute}
            path="/models/create"
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
      </HintsProvider>
    </ApolloProvider>
  </I18nProvider>
)

export default hot(withRouter(App))
