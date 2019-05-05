import { Trans } from '@lingui/macro'
import Button from '@material/react-button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import Icon from '@material/react-material-icon'
import React, { useState, useCallback } from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import deleteDeckMutation from '../graphql/deleteDeckMutation.gql'
import {
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
} from '../graphql/__generated__/DeleteDeckMutation'
import decksQuery from '../graphql/decksQuery.gql'
import { DecksQuery } from '../graphql/__generated__/DecksQuery'

interface Props {
  deckId: string
}

const DeleteDeckButton: React.FunctionComponent<
  RouteComponentProps &
    ChildMutateProps<Props, DeleteDeckMutation, DeleteDeckMutationVariables>
> = ({ deckId, history, mutate }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClose = useCallback(
    (action: string) => {
      if (action === 'confirm') {
        mutate({
          variables: { deckId },
          update: (
            cache,
            {
              data: {
                deleteDeck: { id },
              },
            }
          ) => {
            const { decks } = cache.readQuery<DecksQuery>({
              query: decksQuery,
            })

            cache.writeQuery({
              query: decksQuery,
              data: { decks: decks.filter(deck => deck.id !== id) },
            })
          },
        }).then(() => {
          history.push('/decks')
        })
      }

      setDialogOpen(false)
    },
    [deckId, history, mutate]
  )

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
        <DialogFooter>
          <DialogButton action="cancel">
            <Trans>Cancel</Trans>
          </DialogButton>
          <DialogButton action="confirm" isDefault>
            <Trans>Delete</Trans>
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default graphql<Props>(deleteDeckMutation)(withRouter(DeleteDeckButton))
