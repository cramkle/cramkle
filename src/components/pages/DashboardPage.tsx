import * as React from 'react'
import Helmet from 'react-helmet'

import DeckList from '../DeckList'

const DashboardPage = () => (
  <React.Fragment>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>

    <DeckList />
  </React.Fragment>
)

export default DashboardPage
