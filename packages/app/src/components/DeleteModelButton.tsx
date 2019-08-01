import { plural, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { compose, graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import Button from './views/Button'
import Icon from './views/Icon'
import { MODELS_QUERY } from './ModelList'
import { ModelsQuery } from './__generated__/ModelsQuery'

interface Props {
  model: { id: string; templates: {}[]; notes: {}[] }
}

interface Mutation {
  deleteModel: {
    id: string
  }
}

const DELETE_MODEL_MUTATION = gql`
  mutation DeleteModelMutation($modelId: ID!) {
    deleteModel(id: $modelId) {
      id
    }
  }
`

const DeleteModelButton: React.FunctionComponent<
  ChildMutateProps<Props & RouteComponentProps, Mutation>
> = ({ model, mutate, history }) => {
  const { i18n } = useLingui()

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
          const { cardModels } = cache.readQuery<ModelsQuery>({
            query: MODELS_QUERY,
          })

          cache.writeQuery({
            query: MODELS_QUERY,
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
      <Button
        outlined
        icon={<Icon icon="delete" aria-hidden="true" />}
        onClick={handleClick}
      >
        <Trans>Delete</Trans>
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose} role="alertdialog">
        <DialogTitle>
          <Trans>Delete model</Trans>
        </DialogTitle>
        <DialogContent>
          <Trans>
            Are you sure you want to delete this model?{' '}
            {i18n._(
              plural(model.notes.length, {
                one: "There's # note",
                other: "There're # notes",
              })
            )}{' '}
            and{' '}
            {i18n._(
              plural(model.templates.length, {
                one: '# template',
                other: '# templates',
              })
            )}{' '}
            associated with it.
          </Trans>
        </DialogContent>
        <DialogFooter>
          <DialogButton action="cancel">Cancel</DialogButton>
          <DialogButton action="confirm" isDefault>
            <Trans>Delete</Trans>
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default compose(
  graphql(DELETE_MODEL_MUTATION),
  withRouter
)(DeleteModelButton)
