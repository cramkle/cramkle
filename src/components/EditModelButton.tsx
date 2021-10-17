import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import type { VFC } from 'react'
import { useState } from 'react'

import { TIMEOUT_MEDIUM, pushErrorToast } from '../toasts/pushToast'
import type {
  UpdateModelMutation,
  UpdateModelMutationVariables,
} from './__generated__/UpdateModelMutation'
import { TextInputField } from './forms/Fields'
import { Button } from './views/Button'
import { Dialog, DialogTitle } from './views/Dialog'

const UPDATE_MODEL_MUTATION = gql`
  mutation UpdateModelMutation($id: ID!, $name: String!) {
    updateModel(input: { id: $id, name: $name }) {
      model {
        id
        name
      }
    }
  }
`

interface Props {
  id: string
  model: { name: string }
}

export const EditModelButton: VFC<Props> = ({ id, model }) => {
  const { i18n } = useLingui()
  const [dialogOpen, setDialogOpen] = useState(false)

  const [mutate] = useMutation<
    UpdateModelMutation,
    UpdateModelMutationVariables
  >(UPDATE_MODEL_MUTATION)

  return (
    <>
      <Button
        className="mr-2"
        variation="outline"
        onClick={() => setDialogOpen(true)}
      >
        <Trans>Edit</Trans>
      </Button>
      <Formik
        initialValues={{ name: model.name }}
        onSubmit={async (values) => {
          try {
            await mutate({ variables: { id, name: values.name } })

            setDialogOpen(false)
          } catch {
            pushErrorToast(
              {
                message: t`An error has occurred when updating the deck`,
              },
              TIMEOUT_MEDIUM
            )
          }
        }}
      >
        {({ handleSubmit, isSubmitting, resetForm, isValid }) => {
          const handleDismiss = () => {
            setDialogOpen(false)
            resetForm()
          }
          return (
            <Dialog
              isOpen={dialogOpen}
              onDismiss={handleDismiss}
              aria-labelledby="edit-model-dialog-title"
              style={{ maxWidth: '320px' }}
            >
              <DialogTitle id="edit-model-dialog-title">
                <Trans>Edit model</Trans>
              </DialogTitle>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <TextInputField
                    id="name"
                    className="w-full"
                    name="name"
                    label={i18n._(t`Name`)}
                  />

                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="self-end mt-4"
                  >
                    <Trans>Update</Trans>
                  </Button>
                </div>
              </form>
            </Dialog>
          )
        }}
      </Formik>
    </>
  )
}
