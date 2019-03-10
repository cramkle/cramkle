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
import client from './utils/apolloClient'

import './theme.scss'

const App: React.FunctionComponent<{}> = () => {
  return (
    <ApolloProvider client={client}>
      <Helmet defaultTitle="Cramkle" titleTemplate="%s - Cramkle" />
      <Switch>
        <Route component={IndexPage} path="/" exact />
        <TopBarRoute
          component={DeckPage}
          RouteComponent={UserRoute}
          path="/d/:slug"
          exact
        />
        <GuestRoute component={RegisterPage} path="/register" exact />
        <GuestRoute component={LoginPage} path="/login" exact />
        <Route component={AboutPage} path="/about" exact />
        <Route component={NotFoundPage} />
      </Switch>
    </ApolloProvider>
  )
}

export default hot(withRouter(App))
