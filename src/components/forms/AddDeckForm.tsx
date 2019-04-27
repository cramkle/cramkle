import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import { Formik } from 'formik'
import { graphql, ChildMutateProps } from 'react-apollo'
import React from 'react'
import * as yup from 'yup'

import decksQuery from '../../graphql/decksQuery.gql'
import { DecksQuery } from '../../graphql/__generated__/DecksQuery'
import createDeckMutation from '../../graphql/createDeckMutation.gql'
import {
  CreateDeckMutation,
  CreateDeckMutationVariables,
} from '../../graphql/__generated__/CreateDeckMutation'
import { TextInputField } from './Fields'

interface Props {
  open: boolean
  onClose: (action: string) => void
}

const AddDeckForm: React.FunctionComponent<
  ChildMutateProps<Props, CreateDeckMutation, CreateDeckMutationVariables>
> = ({ open, onClose, mutate }) => (
  <Formik
    initialValues={{
      title: '',
      description: '',
    }}
    validationSchema={yup.object().shape({
      title: yup.string().required('The title is required'),
      description: yup.string(),
    })}
    onSubmit={(values, props) => {
      return mutate({
        variables: values,
        update: (proxy, { data: { createDeck } }) => {
          const data = proxy.readQuery<DecksQuery>({ query: decksQuery })

          data.decks.push(createDeck)

          proxy.writeQuery({ query: decksQuery, data })
        },
      }).then(() => {
        props.resetForm()
        onClose('created')
      })
    }}
    isInitialValid={false}
  >
    {({ isValid, handleSubmit }) => {
      const handleClose = (action: string) => {
        if (action === 'create') {
          handleSubmit()
        }

        onClose(action)
      }

      return (
        <Dialog scrimClickAction="dismiss" open={open} onClose={handleClose}>
          <DialogTitle>Add deck</DialogTitle>
          <DialogContent style={{ width: '320px' }}>
            <TextInputField
              id="title"
              className="w-100"
              name="title"
              label="Title"
            />
            <TextInputField
              id="description"
              className="w-100 mt3"
              name="description"
              label="Description"
              textarea
            />
          </DialogContent>
          <DialogFooter>
            <DialogButton
              action="create"
              isDefault
              type="submit"
              disabled={!isValid}
            >
              Create
            </DialogButton>
          </DialogFooter>
        </Dialog>
      )
    }}
  </Formik>
)

export default graphql<Props, CreateDeckMutation, CreateDeckMutationVariables>(
  createDeckMutation
)(AddDeckForm)
