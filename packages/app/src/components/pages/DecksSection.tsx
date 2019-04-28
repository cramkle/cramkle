import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import React, { useState, useCallback } from 'react'

import DeckList from '../DeckList'
import AddDeckForm from '../forms/AddDeckForm'

const DecksSection: React.FunctionComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  return (
    <>
      <DeckList />

      <AddDeckForm open={dialogOpen} onClose={handleDialogClose} />

      <div className="fixed right-0 bottom-0 pa4">
        <Fab
          icon={<MaterialIcon icon="add" />}
          textLabel="Add Deck"
          onClick={handleDialogOpen}
        />
      </div>
    </>
  )
}

export default DecksSection
