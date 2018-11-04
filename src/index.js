import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './theme.scss'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM
  .createRoot(document.getElementById('root'), { hydrate: true })
  .render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

registerServiceWorker()
