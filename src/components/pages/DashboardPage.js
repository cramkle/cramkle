import React, { Fragment } from 'react'
import Helmet from 'react-helmet'

import DeckList from '../DeckList'

const DashboardPage = () => (
  <Fragment>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>

    <DeckList />
  </Fragment>
)

export default DashboardPage
