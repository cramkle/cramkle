import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import React, { useState } from 'react'

import AddModelForm from '../forms/AddModelForm'
import ModelList from '../ModelList'

const ModelsSection: React.FunctionComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  return (
    <>
      <ModelList />

      <AddModelForm open={dialogOpen} onClose={handleDialogClose} />

      <div className="fixed right-0 bottom-0 pa4">
        <Fab
          icon={<MaterialIcon icon="add" />}
          textLabel="Add model"
          onClick={handleDialogOpen}
        />
      </div>
    </>
  )
}

export default ModelsSection
