import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import * as yup from 'yup'

import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushToast,
} from '../../toasts/pushToast'
import { deckCardFragment } from '../DeckCard'
import { DECKS_QUERY } from '../pages/DecksSection'
import { DecksQuery } from '../pages/__generated__/DecksQuery'
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

          pushToast(
            {
              message: t`Deck created successfully!`,
              action: {
                label: t`View`,
                onPress: () => {
                  history.push(`/d/${slug}`)
                },
              },
            },
            TIMEOUT_MEDIUM
          )

          resetForm()
          onClose()
        } catch (e) {
          console.error(e)
          pushErrorToast(
            {
              message: t`An error ocurred when creating the deck`,
            },
            TIMEOUT_MEDIUM
          )
        }
      }}
    >
      {({ isValid, handleSubmit, isSubmitting, resetForm }) => {
        const handleDismiss = () => {
          resetForm()
          onClose()
        }

        return (
          <Dialog
            isOpen={open}
            onDismiss={handleDismiss}
            style={{ maxWidth: '320px' }}
            aria-labelledby="add-deck-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="add-deck-dialog-title">
                <Trans>Create new deck</Trans>
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
