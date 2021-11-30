import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useRef, useState } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router'

import { TIMEOUT_MEDIUM, pushErrorToast, pushToast } from '../toasts/pushToast'
import { deckCardFragment } from './DeckCard'
import type {
  ImportDeckMutation,
  ImportDeckMutationVariables,
} from './__generated__/ImportDeckMutation'
import { GenericAddIcon } from './icons/GenericAddIcon'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import { Button } from './views/Button'

const IMPORT_DECK_MUTATION = gql`
  mutation ImportDeckMutation($id: ID!) {
    importDeck(input: { id: $id }) {
      deck {
        id
        slug
      }
    }
  }
`

interface Props {
  deckId: string
}

const ImportPublishedDeckButton: React.FunctionComponent<Props> = ({
  deckId,
}) => {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mutate] = useMutation<ImportDeckMutation, ImportDeckMutationVariables>(
    IMPORT_DECK_MUTATION
  )

  const handleImport = async () => {
    try {
      const mutationResult = await mutate({
        variables: { id: deckId },
        update: (cache, mutationResult) => {
          cache.modify({
            fields: {
              decks(existingDecks = []) {
                const newDeckRef = cache.writeFragment({
                  data: mutationResult.data!.importDeck!.deck!,
                  fragment: deckCardFragment,
                })

                return [...existingDecks, newDeckRef]
              },
            },
          })
        },
      })

      if (!mutationResult.data) {
        return
      }

      const slug = mutationResult.data!.importDeck!.deck!.slug

      pushToast(
        {
          message: t`Deck imported successfully!`,
          action: {
            label: t`View`,
            onPress: () => {
              navigate(`/d/${slug}`)
            },
          },
        },
        TIMEOUT_MEDIUM
      )
    } catch (e) {
      console.error(e)
      pushErrorToast(
        {
          message: t`An error occurred when importing the deck`,
        },
        TIMEOUT_MEDIUM
      )
    }
    setDialogOpen(false)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        className="my-2 flex-shrink-0"
        variation="outline"
        onClick={() => setDialogOpen(true)}
      >
        <GenericAddIcon className="mr-2 flex-shrink-0" />
        <Trans>Import published deck</Trans>
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>Import published deck</Trans>
        </AlertDialogLabel>
        <AlertDialogDescription>
          <Trans>This action will add this deck to your library.</Trans>
        </AlertDialogDescription>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setDialogOpen(false)}
            ref={cancelRef}
            variation="secondary"
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button className="ml-3" onClick={handleImport}>
            <Trans>Import deck</Trans>
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}

export default ImportPublishedDeckButton
