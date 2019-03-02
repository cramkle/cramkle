import { Formik } from 'formik'
import { isEmpty } from 'ramda'
import { graphql, ChildMutateProps } from 'react-apollo'
import React, { useCallback, useRef } from 'react'
import * as yup from 'yup'
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'

import InputField from './InputField'
import createDeckMutation from '../../graphql/createDeckMutation.gql'

interface Props {
  open: boolean
  onClose: () => void
}

const AddDeckForm: React.FunctionComponent<ChildMutateProps<Props>> = ({
  open,
  onClose,
  mutate,
}) => {
  const formRef = useRef<Formik>(null)

  const handleClose = useCallback(
    (action: string) => {
      return new Promise((resolve, reject) => {
        if (action === 'create') {
          return formRef.current.runValidations().then(errors => {
            if (isEmpty(errors)) {
              return formRef.current.submitForm()
            } else {
              return reject('Form submit with errors')
            }
          })
        } else {
          resolve()
        }
      }).then(onClose)
    },
    [onClose, formRef.current]
  )

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
      onSubmit={({ title, description }) => {
        console.log('on submit')
        mutate({ variables: { title, description } }).then(() => {
          onClose()
        })
      }}
      isInitialValid={false}
      ref={formRef}
    >
      {({ handleSubmit }) => (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add deck</DialogTitle>
          <DialogContent>
            <form className="w-100" onSubmit={handleSubmit}>
              <InputField className="w-100" name="title" label="Title" />
              <InputField
                className="w-100 mt3"
                name="description"
                label="Description"
              />
            </form>
          </DialogContent>
          <DialogFooter>
            <DialogButton action="create" isDefault>
              Create
            </DialogButton>
          </DialogFooter>
        </Dialog>
      )}
    </Formik>
  )
}

export default graphql<Props>(createDeckMutation)(AddDeckForm)
