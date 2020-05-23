import { useMutation } from '@apollo/react-hooks'
import { Trans, plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router'

import { notificationState } from '../notification/index'
import { MODELS_QUERY } from './ModelList'
import {
  DeleteModelMutation,
  DeleteModelMutationVariables,
} from './__generated__/DeleteModelMutation'
import { ModelsQuery } from './__generated__/ModelsQuery'
import DeleteIcon from './icons/DeleteIcon'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import Button from './views/Button'

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

        const cardModels = cachedModelsQuery?.models

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

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button variation="outline" onClick={handleClick}>
        <DeleteIcon className="mr-2" />
        <Trans>Delete</Trans>
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>Delete model</Trans>
        </AlertDialogLabel>
        <AlertDialogDescription>
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
        </AlertDialogDescription>
        <div className="flex justify-end items-center">
          <Button onClick={handleClose} disabled={deleting} ref={cancelRef}>
            Cancel
          </Button>
          <Button className="ml-3" onClick={handleDelete} disabled={deleting}>
            <Trans>Delete</Trans>
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}

export default DeleteModelButton
