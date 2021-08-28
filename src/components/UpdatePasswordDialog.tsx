import { useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import * as yup from 'yup'

import { pushSimpleToast } from '../toasts/pushToast'
import type {
  UpdatePassword,
  UpdatePasswordVariables,
} from './__generated__/UpdatePassword'
import { TextInputField } from './forms/Fields'
import { Button } from './views/Button'
import { CircularProgress } from './views/CircularProgress'
import { Dialog, DialogTitle } from './views/Dialog'
import { Subtitle2 } from './views/Typography'

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updateProfile(
      input: { currentPassword: $currentPassword, password: $newPassword }
    ) {
      user {
        id
      }
      error {
        type
        status
        fields {
          fieldName
          errorDescription
        }
      }
    }
  }
`

export default function UpdatePasswordDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [updatePassword, { loading }] = useMutation<
    UpdatePassword,
    UpdatePasswordVariables
  >(UPDATE_PASSWORD_MUTATION)

  return (
    <Dialog
      isOpen={open}
      onDismiss={onClose}
      aria-labelledby="change-password-dialog-title"
    >
      <DialogTitle id="change-password-dialog-title">
        <Trans>Change password</Trans>
      </DialogTitle>

      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={yup.object().shape({
          currentPassword: yup
            .string()
            .required(t`Current password is required to change your password`),
          newPassword: yup
            .string()
            .min(6, t`New password must be at lest 6 characters`)
            .required(t`New password is required`),
          confirmNewPassword: yup
            .string()
            .when('newPassword', {
              is: (val: string) => !!val,
              then: yup
                .string()
                .oneOf(
                  [yup.ref('newPassword')],
                  t`Confirm password must be equal to the new password`
                ),
            })
            .required(t`Confirm password is required`),
        })}
        onSubmit={(values, helpers) => {
          updatePassword({
            variables: {
              newPassword: values.newPassword,
              currentPassword: values.currentPassword,
            },
          }).then((mutationResult) => {
            if (mutationResult.errors || !mutationResult.data?.updateProfile) {
              pushSimpleToast(t`An unexpected error has occurred`)
              return
            }

            if (mutationResult.data.updateProfile.error) {
              if (!mutationResult.data.updateProfile.error.fields) {
                pushSimpleToast(t`An unexpected error has occurred`)
                return
              }

              const formErrors = Object.fromEntries(
                mutationResult.data.updateProfile.error.fields.map(
                  ({ fieldName, errorDescription }) => [
                    fieldName,
                    errorDescription,
                  ]
                )
              )

              helpers.setErrors(formErrors)
              return
            }

            pushSimpleToast(t`Password changed successfully`)

            onClose?.()
          })
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextInputField
              label={t`Current password`}
              name="currentPassword"
              autoComplete="current-password"
              aria-describedby="profile-current-password-change-description"
              type="password"
            />

            <Subtitle2
              id="profile-current-password-change-description"
              className="text-txt text-opacity-text-primary mt-3"
            >
              <Trans>
                For security, please enter your current password to continue.
              </Trans>
            </Subtitle2>

            <TextInputField
              className="mt-6"
              label={t`New password`}
              name="newPassword"
              autoComplete="new-password"
              type="password"
            />
            <TextInputField
              className="mt-3"
              label={t`Confirm new password`}
              name="confirmNewPassword"
              autoComplete="new-password"
              type="password"
            />

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variation="secondary"
                onClick={onClose}
                disabled={loading}
              >
                <Trans>Cancel</Trans>
              </Button>

              <Button className="ml-4" variation="primary" disabled={loading}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Trans>Update account password</Trans>
                )}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}
