import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'
import { RouteComponentProps, withRouter } from 'react-router'
import * as yup from 'yup'

import { TextInputField } from './Fields'
import {
  CreateDeckMutation,
  CreateDeckMutationVariables,
} from './__generated__/CreateDeckMutation'
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogActions,
} from '../views/Dialog'
import Button from '../views/Button'
import { DECKS_QUERY } from '../DeckList'
import { DecksQuery } from '../__generated__/DecksQuery'
import { notificationState } from '../../notification'

interface Props {
  open: boolean
  onClose: () => void
}

export const CREATE_DECK_MUTATION = gql`
  mutation CreateDeckMutation($title: String!, $description: String) {
    createDeck(title: $title, description: $description) {
      id
      slug
      title
      description
    }
  }
`

const titleRequired = t`The title is required`

const AddDeckForm: React.FunctionComponent<
  ChildMutateProps<Props, CreateDeckMutation, CreateDeckMutationVariables> &
    RouteComponentProps
> = ({ open, onClose, mutate, history }) => {
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
              const data = proxy.readQuery<DecksQuery>({ query: DECKS_QUERY })

              data.decks.push(createDeck)

              proxy.writeQuery({ query: DECKS_QUERY, data })
            },
          })

          if (!mutationResult) {
            return
          }

          const slug = mutationResult.data.createDeck.slug

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
        const handleClose = () => {
          onClose()
        }

        const handleCreate = () => {
          handleSubmit()
        }

        return (
          <form onSubmit={handleSubmit}>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                <Trans>Add Deck</Trans>
              </DialogTitle>
              <DialogContent style={{ width: '320px' }}>
                <TextInputField
                  id="title"
                  className="w-100"
                  name="title"
                  label={i18n._(t`Title`)}
                />
                <TextInputField
                  id="description"
                  className="w-100 mt3"
                  name="description"
                  label={i18n._(t`Description`)}
                  textarea
                />
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  onClick={handleCreate}
                >
                  <Trans>Create</Trans>
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )
      }}
    </Formik>
  )
}

export default graphql<Props, CreateDeckMutation, CreateDeckMutationVariables>(
  CREATE_DECK_MUTATION
)(withRouter(AddDeckForm))
