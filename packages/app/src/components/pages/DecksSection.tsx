import { t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Icon from '@material/react-material-icon'
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
        <I18n>
          {({ i18n }) => (
            <Fab
              icon={<Icon icon="add" aria-hidden="true" />}
              textLabel={i18n._(t`Add Deck`)}
              onClick={handleDialogOpen}
            />
          )}
        </I18n>
      </div>
    </>
  )
}

export default DecksSection
