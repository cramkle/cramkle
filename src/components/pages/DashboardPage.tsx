import React, { Fragment, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'

import TabBar from '@material/react-tab-bar'
import Tab from '@material/react-tab'
import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'

import DeckList from '../DeckList'
import AddDeckForm from '../forms/AddDeckForm'

const DashboardPage: React.FunctionComponent = () => {
  const [index, setIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleActiveIndexUpdate = useCallback(index => {
    setIndex(index)
  }, [])

  return (
    <Fragment>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <div className="h-100 flex flex-column">
        <TabBar
          activeIndex={index}
          handleActiveIndexUpdate={handleActiveIndexUpdate}
        >
          <Tab>Study</Tab>
          <Tab>Decks</Tab>
        </TabBar>

        <DeckList />
      </div>

      <AddDeckForm open={dialogOpen} onClose={handleDialogClose} />

      <div className="fixed right-0 bottom-0 pa4">
        <Fab
          icon={<MaterialIcon icon="add" />}
          textLabel="Add Deck"
          onClick={handleDialogOpen}
        />
      </div>
    </Fragment>
  )
}

export default DashboardPage
