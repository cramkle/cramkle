import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import React, { useState, useCallback } from 'react'

import DeckList from '../DeckList'
import Fab from '../views/Fab'
import Icon from '../views/Icon'
import AddDeckForm from '../forms/AddDeckForm'
import { useHints } from '../HintsContext'

import styles from './DecksSection.css'

const DecksSection: React.FunctionComponent = () => {
  const { i18n } = useLingui()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { isMobile } = useHints()

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

      <div className={classNames(styles.fab, 'fixed')}>
        <Fab
          icon={<Icon icon="add" aria-hidden="true" />}
          aria-label={i18n._(t`Add Deck`)}
          textLabel={!isMobile && i18n._(t`Add Deck`)}
          onClick={handleDialogOpen}
        />
      </div>
    </>
  )
}

export default DecksSection
