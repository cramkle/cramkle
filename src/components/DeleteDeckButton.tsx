import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import gql from 'graphql-tag'
import { useCallback, useRef, useState } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router'

import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushSimpleToast,
} from '../toasts/pushToast'
import {
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
} from './__generated__/DeleteDeckMutation'
import TrashBinIcon from './icons/TrashBinIcon'
import { DECKS_QUERY } from './pages/DecksSection'
import { DecksQuery } from './pages/__generated__/DecksQuery'
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
  const navigate = useNavigate()
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
        const deletedDeckId = data?.deleteDeck?.deck?.id

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
        navigate('/decks')

        pushSimpleToast(t`Deck deleted successfully`)
      })
      .catch(() => {
        setDeleting(false)

        pushErrorToast(
          {
            message: t`An error ocurred when deleting the deck`,
          },
          TIMEOUT_MEDIUM
        )
      })
  }, [deckId, navigate, mutate])

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
        className="my-2 flex-shrink-0"
        variation="outline"
        onClick={() => setDialogOpen(true)}
      >
        <TrashBinIcon className="mr-2 flex-shrink-0" />
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
