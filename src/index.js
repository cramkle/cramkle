import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import './theme.scss'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

// const token = localStorage.userToken

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)

registerServiceWorker()
