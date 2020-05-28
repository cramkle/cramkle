import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import gql from 'graphql-tag'
import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router'

import { notificationState } from '../notification/index'
import { DECKS_QUERY } from './DeckList'
import { DecksQuery } from './__generated__/DecksQuery'
import {
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
} from './__generated__/DeleteDeckMutation'
import DeleteIcon from './icons/DeleteIcon'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import Button from './views/Button'

interface Props {
  deckId: string
}

const DELETE_DECK_MUTATION = gql`
  mutation DeleteDeckMutation($deckId: ID!) {
    deleteDeck(input: { id: $deckId }) {
      deck {
        id
      }
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
        const deletedDeckId = data?.deleteDeck?.deck.id

        const cachedDecksQuery = cache.readQuery<DecksQuery>({
          query: DECKS_QUERY,
        })

        const decks = cachedDecksQuery?.decks

        if (decks && deletedDeckId) {
          cache.writeQuery({
            query: DECKS_QUERY,
            data: { decks: decks.filter((deck) => deck.id !== deletedDeckId) },
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

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        className="my-2"
        variation="outline"
        onClick={() => setDialogOpen(true)}
      >
        <DeleteIcon className="mr-2" />
        <Trans>Delete</Trans>
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>Delete deck</Trans>
        </AlertDialogLabel>
        <AlertDialogDescription>
          <Trans>Are you sure you want to delete this deck?</Trans>
        </AlertDialogDescription>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={deleting}
            ref={cancelRef}
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button className="ml-3" onClick={handleDelete} disabled={deleting}>
            <Trans>Delete</Trans>
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}

export default DeleteDeckButton
