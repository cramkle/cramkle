import Button from '@material/react-button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import MaterialIcon from '@material/react-material-icon'
import React, { useState, useCallback } from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import { IDeck } from '../types/Deck'
import deleteDeckMutation from '../graphql/deleteDeckMutation.gql'
import decksQuery from '../graphql/decksQuery.gql'

interface Props {
  deckId: string
}

interface Data {
  deleteDeck: {
    id: string
  }
}

const DeleteDeckButton: React.FunctionComponent<
  RouteComponentProps & ChildMutateProps<Props, Data>
> = ({ deckId, history, mutate }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClose = useCallback((action: string) => {
    console.log(action)

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
          const { decks } = cache.readQuery<{ decks: IDeck[] }>({
            query: decksQuery,
          })

          cache.writeQuery({
            query: decksQuery,
            data: { decks: decks.filter(deck => deck.id !== id) },
          })
        },
      }).then(() => {
        history.push('/dashboard')
      })
    }

    setDialogOpen(false)
  }, [])

  return (
    <>
      <Button
        className="mv2"
        icon={<MaterialIcon icon="delete" />}
        outlined
        onClick={() => setDialogOpen(true)}
      >
        Delete
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose} role="alertdialog">
        <DialogTitle>Delete deck</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this deck?
        </DialogContent>
        <DialogFooter>
          <DialogButton action="cancel">Cancel</DialogButton>
          <DialogButton action="confirm" isDefault>
            Delete
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default graphql<Props>(deleteDeckMutation)(withRouter(DeleteDeckButton))
