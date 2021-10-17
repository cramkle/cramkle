import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import type { VFC } from 'react'
import { useState } from 'react'

import { TIMEOUT_MEDIUM, pushErrorToast } from '../toasts/pushToast'
import { TextInputField } from './forms/Fields'
import { Button } from './views/Button'
import { Dialog, DialogTitle } from './views/Dialog'

const UPDATE_DECK_MUTATION = gql`
  mutation UpdateDeckMutation($id: ID!, $title: String!, $description: String) {
    updateDeck(input: { id: $id, title: $title, description: $description }) {
      deck {
        id
        title
        description
      }
    }
  }
`

interface Props {
  deckId: string
  deck: { title: string; description: string | null }
}

export const EditDeckButton: VFC<Props> = ({ deckId, deck }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mutate] = useMutation(UPDATE_DECK_MUTATION)
  const { i18n } = useLingui()

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
        initialValues={{ title: deck.title, description: deck.description }}
        onSubmit={async (values) => {
          try {
            await mutate({
              variables: {
                id: deckId,
                title: values.title,
                description: values.description,
              },
            })

            setDialogOpen(false)
          } catch {
            pushErrorToast(
              {
                message: t`An error occurred when updating the deck`,
              },
              TIMEOUT_MEDIUM
            )
          }
        }}
      >
        {({ isValid, handleSubmit, isSubmitting, resetForm }) => {
          const handleDismiss = () => {
            resetForm()
            setDialogOpen(false)
          }
          return (
            <Dialog
              isOpen={dialogOpen}
              onDismiss={handleDismiss}
              aria-labelledby="edit-deck-dialog-title"
              style={{ maxWidth: '320px' }}
            >
              <form onSubmit={handleSubmit}>
                <DialogTitle id="edit-deck-dialog-title">
                  <Trans>Edit deck</Trans>
                </DialogTitle>
                <div className="flex flex-col">
                  <TextInputField
                    id="title"
                    className="w-full"
                    name="title"
                    label={i18n._(t`Title`)}
                  />
                  <TextInputField
                    id="description"
                    className="w-full mt-4"
                    name="description"
                    label={i18n._(t`Description`)}
                    textarea
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
