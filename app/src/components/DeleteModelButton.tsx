import { useMutation } from '@apollo/react-hooks'
import { Trans, plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useHistory } from 'react-router'

import { notificationState } from '../notification/index'
import { MODELS_QUERY } from './ModelList'
import {
  DeleteModelMutation,
  DeleteModelMutationVariables,
} from './__generated__/DeleteModelMutation'
import { ModelsQuery } from './__generated__/ModelsQuery'
import Button from './views/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from './views/Dialog'
import Icon from './views/Icon'

interface Props {
  model: { id: string; templates: {}[]; notes: {}[] }
}

const DELETE_MODEL_MUTATION = gql`
  mutation DeleteModelMutation($modelId: ID!) {
    deleteModel(id: $modelId) {
      id
    }
  }
`

const DeleteModelButton: React.FunctionComponent<Props> = ({ model }) => {
  const history = useHistory()
  const [mutate] = useMutation<
    DeleteModelMutation,
    DeleteModelMutationVariables
  >(DELETE_MODEL_MUTATION)

  const { i18n } = useLingui()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = () => {
    setDeleting(true)

    mutate({
      variables: { modelId: model.id },
      update: (cache, { data }) => {
        const deletedModelId = data?.deleteModel?.id

        const cachedModelsQuery = cache.readQuery<ModelsQuery>({
          query: MODELS_QUERY,
        })

        const cardModels = cachedModelsQuery?.cardModels

        if (cardModels && deletedModelId) {
          cache.writeQuery({
            query: MODELS_QUERY,
            data: {
              cardModels: cardModels.filter(
                (model) => model.id !== deletedModelId
              ),
            },
          })
        }
      },
    })
      .then(() => {
        history.push('/models')

        notificationState.addNotification({
          message: t`Model deleted successfully`,
        })
      })
      .catch(() => {
        setDeleting(false)

        notificationState.addNotification({
          message: t`An error ocurred when deleting the model`,
          actionText: t`Dismiss`,
        })
      })
  }

  const handleClose = () => {
    if (deleting) {
      return
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
        <DialogActions>
          <Button onClick={handleClose} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={deleting}>
            <Trans>Delete</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteModelButton
