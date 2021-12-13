import { gql, useMutation } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import * as React from 'react'
import type { VFC } from 'react'

import { DECKS_QUERY } from '../pages/DecksSection'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import { Button } from './views/Button'

const PUBLISH_DECK_MUTATION = gql`
  mutation PublishDeckMutation($id: ID!) {
    publishDeck(input: { id: $id }) {
      deck {
        id
      }
    }
  }
`

const UNPUBLISH_DECK_MUTATION = gql`
  mutation UnpublishDeckMutation($id: ID!) {
    unpublishDeck(input: { id: $id }) {
      deck {
        id
      }
    }
  }
`
interface Props {
  deckId: string
  deck: { title: string; published: boolean }
}

export const PublishDeckButton: VFC<Props> = ({ deckId, deck }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [publishDeck] = useMutation(PUBLISH_DECK_MUTATION)
  const [unpublishDeck] = useMutation(UNPUBLISH_DECK_MUTATION)

  const cancelDialog = React.useRef(null)

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleDeckPublish = async () => {
    await publishDeck({
      variables: {
        id: deckId,
      },
      refetchQueries: [{ query: DECKS_QUERY }],
    })
    setDialogOpen(false)
  }

  const handleDeckUnpublish = async () => {
    await unpublishDeck({
      variables: {
        id: deckId,
      },
      refetchQueries: [{ query: DECKS_QUERY }],
    })
    setDialogOpen(false)
  }

  return (
    <>
      <Button
        className="mr-2"
        variation={deck.published ? 'primary' : 'outline'}
        onClick={() => setDialogOpen(true)}
      >
        <p>{deck.published}</p>
        {deck.published ? <Trans>Published</Trans> : <Trans>Publish</Trans>}
      </Button>

      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelDialog}
      >
        {deck.published ? (
          <UnpublishDialog
            handleClose={handleClose}
            handleDeckUnpublish={handleDeckUnpublish}
            cancelDeckUnpublish={cancelDialog}
          />
        ) : (
          <PublishDialog
            handleClose={handleClose}
            handleDeckPublish={handleDeckPublish}
            cancelDeckPublish={cancelDialog}
          />
        )}
      </AlertDialog>
    </>
  )
}

interface PublishDialogProps {
  handleClose: () => void
  handleDeckPublish: () => void
  cancelDeckPublish: React.MutableRefObject<null>
}
const PublishDialog: React.FC<PublishDialogProps> = ({
  handleClose,
  handleDeckPublish,
  cancelDeckPublish,
}) => {
  return (
    <>
      <AlertDialogLabel>
        <Trans>Are you sure you want to publish this deck?</Trans>
      </AlertDialogLabel>
      <AlertDialogDescription>
        <Trans>
          You will share this deck publicly with all Cramkle users via the
          Marketplace. Be careful with sensitive or personal information in your
          deck.
        </Trans>
      </AlertDialogDescription>
      <div className="flex flex-col sm:flex-row flex-wrap justify-end items-stretch sm:items-center">
        <Button
          variation="secondary"
          onClick={handleClose}
          ref={cancelDeckPublish}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button className="mt-3 sm:mt-0 sm:ml-3" onClick={handleDeckPublish}>
          <Trans>Publish on Marketplace</Trans>
        </Button>
      </div>
    </>
  )
}

interface UnpublishDialogProps {
  handleClose: () => void
  handleDeckUnpublish: () => void
  cancelDeckUnpublish: React.MutableRefObject<null>
}
const UnpublishDialog: React.FC<UnpublishDialogProps> = ({
  handleClose,
  handleDeckUnpublish,
  cancelDeckUnpublish,
}) => {
  return (
    <>
      <AlertDialogLabel>
        <Trans>Are you sure you want to unpublish this deck?</Trans>
      </AlertDialogLabel>
      <AlertDialogDescription>
        <Trans>
          You will <span className="font-bold">stop sharing</span> this deck
          publicly with all Cramkle users via the Marketplace.
        </Trans>
      </AlertDialogDescription>
      <div className="flex flex-col sm:flex-row flex-wrap justify-end items-stretch sm:items-center">
        <Button
          variation="secondary"
          onClick={handleClose}
          ref={cancelDeckUnpublish}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button className="mt-3 sm:mt-0 sm:ml-3" onClick={handleDeckUnpublish}>
          <Trans>Unpublish from Marketplace</Trans>
        </Button>
      </div>
    </>
  )
}
