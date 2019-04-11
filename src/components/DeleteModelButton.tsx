import Button from '@material/react-button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import Icon from '@material/react-material-icon'
import React, { useState } from 'react'
import { compose, graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import deleteModelMutation from '../graphql/deleteModelMutation.gql'
import modelsQuery from '../graphql/modelsQuery.gql'

interface Props {
  model: { id: string; templates: {}[]; notes: {}[] }
}

interface Mutation {
  deleteModel: {
    id: string
  }
}

const DeleteModelButton: React.FunctionComponent<
  ChildMutateProps<Props & RouteComponentProps, Mutation>
> = ({ model, mutate, history }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClose = (action: string) => {
    if (action === 'confirm') {
      mutate({
        variables: { modelId: model.id },
        update: (
          cache,
          {
            data: {
              deleteModel: { id },
            },
          }
        ) => {
          const { cardModels } = cache.readQuery<{ cardModels: any[] }>({
            query: modelsQuery,
          })

          cache.writeQuery({
            query: modelsQuery,
            data: { cardModels: cardModels.filter(model => model.id !== id) },
          })
        },
      }).then(() => {
        history.push('/models')
      })
    }

    setDialogOpen(false)
  }

  const handleClick = () => {
    setDialogOpen(true)
  }

  return (
    <>
      <Button outlined icon={<Icon icon="delete" />} onClick={handleClick}>
        Delete
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose} role="alertdialog">
        <DialogTitle>Delete model</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this model? There are{' '}
          {model.notes.length} notes and {model.templates.length} templates
          associated with it.
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

export default compose(
  graphql(deleteModelMutation),
  withRouter
)(DeleteModelButton)
