import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useRef, useState } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router'

import { TIMEOUT_MEDIUM, pushErrorToast, pushToast } from '../toasts/pushToast'
import { deckCardFragment } from './DeckCard'
import type {
  InstallDeckMutation,
  InstallDeckMutationVariables,
} from './__generated__/InstallDeckMutation'
import { GenericAddIcon } from './icons/GenericAddIcon'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import { Button } from './views/Button'

const INSTALL_DECK_MUTATION = gql`
  mutation InstallDeckMutation($id: ID!) {
    installDeck(input: { id: $id }) {
      deck {
        id
        slug
        isDeckInstalled
      }
    }
  }
`

interface Props {
  deckId: string
  isDeckInstalled: boolean
}

const InstallPublishedDeckButton: React.FunctionComponent<Props> = ({
  deckId,
  isDeckInstalled,
}) => {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mutate] = useMutation<
    InstallDeckMutation,
    InstallDeckMutationVariables
  >(INSTALL_DECK_MUTATION)

  const handleInstall = async () => {
    try {
      const mutationResult = await mutate({
        variables: { id: deckId },
        update: (cache, mutationResult) => {
          cache.modify({
            fields: {
              decks(existingDecks = []) {
                const newDeckRef = cache.writeFragment({
                  data: mutationResult.data!.installDeck!.deck!,
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

      const slug = mutationResult.data!.installDeck!.deck!.slug

      pushToast(
        {
          message: t`Deck installed successfully!`,
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
          message: t`An error occurred when installing the deck`,
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
        disabled={isDeckInstalled}
      >
        {!isDeckInstalled ? (
          <>
            <GenericAddIcon className="mr-2 flex-shrink-0" />
            <Trans>Install published deck</Trans>
          </>
        ) : (
          <>
            <GenericAddIcon className="mr-2 flex-shrink-0" />
            <Trans>Deck already installed</Trans>
          </>
        )}
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>Install published deck</Trans>
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
          <Button className="ml-3" onClick={handleInstall}>
            <Trans>Install deck</Trans>
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}

export default InstallPublishedDeckButton
