import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'

import DeckList from '../DeckList'

const DashboardPage = () => (
  <Fragment>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>

    <DeckList />

    <div className="absolute right-0 bottom-0 pa4">
      <Fab icon={<MaterialIcon icon="add" />} textLabel="Add Deck" />
    </div>
  </Fragment>
)

export default DashboardPage
