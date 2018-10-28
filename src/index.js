import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import './theme.scss'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { fetchUser } from './actions/user'
import setAuthorizationHeader from './utils/setAuthorizationHeader'

const history = createBrowserHistory()

const saga = createSagaMiddleware()

const store = createStore(
  connectRouter(history)(rootReducer),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), saga))
)

saga.run(rootSaga)

const token = localStorage.userToken

if (token) {
  setAuthorizationHeader(token)
  store.dispatch(fetchUser(token))
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
