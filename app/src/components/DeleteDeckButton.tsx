import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import gql from 'graphql-tag'
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router'

import { notificationState } from 'notification/index'
import Button from 'views/Button'
import Icon from 'views/Icon'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'views/Dialog'
import {
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
} from './__generated__/DeleteDeckMutation'
import { DECKS_QUERY } from './DeckList'
import { DecksQuery } from './__generated__/DecksQuery'

interface Props {
  deckId: string
}

const DELETE_DECK_MUTATION = gql`
  mutation DeleteDeckMutation($deckId: ID!) {
    deleteDeck(id: $deckId) {
      id
    }
  }
`

const DeleteDeckButton: React.FunctionComponent<Props> = ({ deckId }) => {
  const history = useHistory()
  const [mutate] = useMutation<DeleteDeckMutation, DeleteDeckMutationVariables>(
    DELETE_DECK_MUTATION
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = useCallback(() => {
    setDeleting(true)

    mutate({
      variables: { deckId },
      update: (cache, { data }) => {
        const deletedDeckId = data && data.deleteDeck && data.deleteDeck.id

        const cachedDecksQuery = cache.readQuery<DecksQuery>({
          query: DECKS_QUERY,
        })

        const decks = cachedDecksQuery && cachedDecksQuery.decks

        if (decks && deletedDeckId) {
          cache.writeQuery({
            query: DECKS_QUERY,
            data: { decks: decks.filter(deck => deck.id !== deletedDeckId) },
          })
        }
      },
    })
      .then(() => {
        history.push('/decks')

        notificationState.addNotification({
          message: t`Deck deleted successfully`,
        })
      })
      .catch(() => {
        setDeleting(false)

        notificationState.addNotification({
          message: t`An error ocurred when deleting the deck`,
          actionText: t`Dismiss`,
        })
      })
  }, [deckId, history, mutate])

  const handleClose = useCallback(() => {
    if (deleting) {
      return
    }

    setDialogOpen(false)
  }, [deleting])

  return (
    <>
      <Button
        className="mv2"
        icon={<Icon icon="delete" aria-hidden="true" />}
        outlined
        onClick={() => setDialogOpen(true)}
      >
        <Trans>Delete</Trans>
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose} role="alertdialog">
        <DialogTitle>
          <Trans>Delete deck</Trans>
        </DialogTitle>
        <DialogContent>
          <Trans>Are you sure you want to delete this deck?</Trans>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={deleting}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={handleDelete} disabled={deleting}>
            <Trans>Delete</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteDeckButton
