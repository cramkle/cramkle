import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import './theme.scss'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

// const token = localStorage.userToken

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
)

registerServiceWorker()
