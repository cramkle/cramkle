import React, { lazy } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch, withRouter, Redirect } from 'react-router'
import { hot } from 'react-hot-loader/root'

import NotificationToasts from './components/NotificationToasts'
import AboutPage from './components/pages/AboutPage'
import LandingPage from './components/pages/LandingPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ShellRoute from './components/routes/ShellRoute'
import { UserRoute, GuestRoute } from './components/routes/AuthRoute'

import './theme.global.scss'

const HomePage = lazy(() => import('./components/pages/HomePage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const MarketplacePage = lazy(() => import('./components/pages/MarketplacePage'))
const ModelPage = lazy(() => import('./components/pages/ModelPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const AddModelPage = lazy(() => import('./components/pages/AddModelPage'))

const App: React.FunctionComponent<{}> = () => (
  <>
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
    <NotificationToasts />
    <Switch>
      <GuestRoute component={LandingPage} path="/" exact />
      <ShellRoute
        component={HomePage}
        RouteComponent={UserRoute}
        path="/home"
        exact
      />
      <Redirect
        from="/decks"
        to={{ pathname: '/home', state: { currentTab: 1 } }}
        exact
      />
      <Redirect
        from="/models"
        to={{ pathname: '/home', state: { currentTab: 2 } }}
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
  </>
)

export default hot(withRouter(App))
