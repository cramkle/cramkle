import { Formik, Field } from 'formik'
import { graphql, ChildMutateProps } from 'react-apollo'
import React, { useRef } from 'react'
import * as yup from 'yup'
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'

import { IDeck } from '../../types/Deck'
import decksQuery from '../../graphql/decksQuery.gql'
import createDeckMutation from '../../graphql/createDeckMutation.gql'
import { TextInput } from './Fields'

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
> = ({ open, onClose, mutate }) => {
  const submittingRef = useRef(false)

  return (
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
        // avoid double submits on enter keypress
        if (submittingRef.current) {
          return
        }

        submittingRef.current = true

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
            submittingRef.current = false
            onClose('created')
          })
          .finally(() => {
            props.setSubmitting(false)
          })
      }}
      isInitialValid={false}
    >
      {({ handleSubmit }) => (
        <Dialog
          tag="form"
          scrimClickAction="dismiss"
          open={open}
          onSubmit={handleSubmit}
          onClose={onClose}
        >
          <DialogTitle>Add deck</DialogTitle>
          <DialogContent style={{ width: '320px' }}>
            <Field
              className="w-100"
              name="title"
              label="Title"
              component={TextInput}
            />
            <Field
              component={TextInput}
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
              // @ts-ignore
              onClick={handleSubmit}
              type="submit"
            >
              Create
            </DialogButton>
          </DialogFooter>
        </Dialog>
      )}
    </Formik>
  )
}

export default graphql<Props, MutationData>(createDeckMutation)(AddDeckForm)
