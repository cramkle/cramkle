import React, { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet'

import TabBar from '@material/react-tab-bar'
import Tab from '@material/react-tab'
import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'

import DeckList from '../DeckList'

const DashboardPage = () => {
  const [index, setIndex] = useState(0)
  return (
    <Fragment>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <TabBar
        activeIndex={index}
        handleActiveIndexUpdate={index => setIndex(index)}
      >
        <Tab>Study</Tab>
        <Tab>Decks</Tab>
      </TabBar>

      <DeckList />

      <div className="absolute right-0 bottom-0 pa4">
        <Fab icon={<MaterialIcon icon="add" />} textLabel="Add Deck" />
      </div>
    </Fragment>
  )
}

export default DashboardPage
