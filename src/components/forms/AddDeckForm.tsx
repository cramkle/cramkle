import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import * as yup from 'yup'

import { notificationState } from '../../notification/index'
import { deckCardFragment } from '../DeckCard'
import { DECKS_QUERY } from '../DeckList'
import { DecksQuery } from '../__generated__/DecksQuery'
import Button from '../views/Button'
import { Dialog, DialogTitle } from '../views/Dialog'
import { TextInputField } from './Fields'
import {
  CreateDeckMutation,
  CreateDeckMutationVariables,
} from './__generated__/CreateDeckMutation'

interface Props {
  open: boolean
  onClose: () => void
}

export const CREATE_DECK_MUTATION = gql`
  mutation CreateDeckMutation($title: String!, $description: String) {
    createDeck(input: { title: $title, description: $description }) {
      deck {
        id
        slug
        ...DeckCard_deck
      }
    }
  }

  ${deckCardFragment}
`

const titleRequired = t`The title is required`

const AddDeckForm: React.FunctionComponent<Props> = ({ open, onClose }) => {
  const history = useHistory()
  const [mutate] = useMutation<CreateDeckMutation, CreateDeckMutationVariables>(
    CREATE_DECK_MUTATION
  )

  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
      }}
      initialErrors={{
        title: i18n._(titleRequired),
      }}
      validationSchema={yup.object().shape({
        title: yup.string().required(i18n._(titleRequired)),
        description: yup.string(),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          const mutationResult = await mutate({
            variables: values,
            update: (proxy, { data: { createDeck } }) => {
              let data = null

              try {
                data = proxy.readQuery<DecksQuery>({ query: DECKS_QUERY })
              } catch {
                data = { decks: [] }
              }

              data.decks.push(createDeck.deck)

              proxy.writeQuery({ query: DECKS_QUERY, data })
            },
          })

          if (!mutationResult) {
            return
          }

          const slug = mutationResult.data.createDeck.deck.slug

          notificationState.addNotification({
            message: t`Deck created successfully!`,
            actionText: t`View`,
            onAction: () => {
              history.push(`/d/${slug}`)
            },
          })

          resetForm()
          onClose()
        } catch (e) {
          console.error(e)
          notificationState.addNotification({
            message: t`An error ocurred when creating the deck`,
            actionText: t`Dismiss`,
          })
        }
      }}
    >
      {({ isValid, handleSubmit, isSubmitting }) => {
        return (
          <Dialog
            isOpen={open}
            onDismiss={onClose}
            style={{ width: '320px' }}
            aria-labelledby="add-deck-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="add-deck-dialog-title">
                <Trans>Add Deck</Trans>
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
                  <Trans>Create</Trans>
                </Button>
              </div>
            </form>
          </Dialog>
        )
      }}
    </Formik>
  )
}

export default AddDeckForm
