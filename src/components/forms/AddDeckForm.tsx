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

import { IDeck } from '../../types/Deck'
import decksQuery from '../../graphql/decksQuery.gql'
import createDeckMutation from '../../graphql/createDeckMutation.gql'
import { TextInputField } from './Fields'

interface Props {
  open: boolean
  onClose: (action: string) => void
}

interface MutationData {
  createDeck: IDeck
}

interface QueryData {
  decks: IDeck[]
}

const AddDeckForm: React.FunctionComponent<
  ChildMutateProps<Props, MutationData>
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
      mutate({
        variables: values,
        update: (proxy, { data: { createDeck } }) => {
          const data = proxy.readQuery<QueryData>({ query: decksQuery })

          data.decks.push(createDeck)

          proxy.writeQuery({ query: decksQuery, data })
        },
      })
        .then(() => {
          props.resetForm()
          onClose('created')
        })
        .finally(() => {
          props.setSubmitting(false)
        })
    }}
    isInitialValid={false}
  >
    {({ handleSubmit, isValid }) => (
      <Dialog
        tag="form"
        scrimClickAction="dismiss"
        open={open}
        onSubmit={handleSubmit}
        onClose={onClose}
      >
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
    )}
  </Formik>
)

export default graphql<Props, MutationData>(createDeckMutation)(AddDeckForm)
