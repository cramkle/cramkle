import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import * as yup from 'yup'

import { pushSimpleToast } from '../toasts/pushToast'
import PasswordPlaceholder from './PasswordPlaceholder'
import SettingItem from './SettingItem'
import UpdatePasswordDialog from './UpdatePasswordDialog'
import {
  UpdateProfile,
  UpdateProfileVariables,
} from './__generated__/UpdateProfile'
import { UserQuery } from './__generated__/UserQuery'
import { TextInputField } from './forms/Fields'
import USER_QUERY from './userQuery.gql'
import Button from './views/Button'
import { Card, CardContent } from './views/Card'
import CircularProgress from './views/CircularProgress'
import { Headline2 } from './views/Typography'

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($email: String, $username: String) {
    updateProfile(input: { email: $email, username: $username }) {
      user {
        id
        username
        email
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

const ProfileSettings: React.FC = () => {
  const { i18n } = useLingui()

  const { data } = useQuery<UserQuery>(USER_QUERY)

  const { username, email } = data!.me!

  const [updateProfile, { loading }] = useMutation<
    UpdateProfile,
    UpdateProfileVariables
  >(UPDATE_PROFILE_MUTATION)

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  return (
    <>
      <UpdatePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
      <Card className="mt-8">
        <CardContent className="flex flex-col">
          <Headline2>
            <Trans>Profile</Trans>
          </Headline2>

          <Formik
            initialValues={{
              username,
              email,
            }}
            validationSchema={yup.object().shape({
              username: yup
                .string()
                .min(4, i18n._(t`Username must be at least 4 characters`))
                .max(20, i18n._(t`Username must be at most 20 characters`))
                .matches(
                  /^[\w\d_]+$/,
                  i18n._(
                    t`Username must consist only of alphanumeric characters and underscores`
                  )
                )
                .required(i18n._(t`Username is required`)),
              email: yup
                .string()
                .email(i18n._(t`Email must be a valid email`))
                .required(i18n._(t`Email is required`)),
            })}
            onSubmit={(profile, helpers) => {
              if (!helpers.validateForm(profile)) {
                return
              }

              updateProfile({ variables: profile }).then((mutationResult) => {
                if (
                  mutationResult.errors ||
                  !mutationResult.data?.updateProfile
                ) {
                  pushSimpleToast(t`An unknown error has occurred`)
                  return
                }

                if (mutationResult.data.updateProfile.error != null) {
                  if (!mutationResult.data.updateProfile.error.fields) {
                    pushSimpleToast(t`An unknown error has occurred`)
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

                pushSimpleToast(t`Profile updated successfully`)
              })
            }}
          >
            {({ handleSubmit }) => (
              <form id="profile-settings-form" onSubmit={handleSubmit}>
                <SettingItem
                  id="profile-username"
                  className="mt-4"
                  title={<Trans>Username</Trans>}
                  description={<Trans>Change your account username</Trans>}
                >
                  <TextInputField id="profile-username" name="username" />
                </SettingItem>
                <SettingItem
                  id="profile-email"
                  className="mt-8"
                  title={<Trans>Email</Trans>}
                  description={<Trans>Update your account email</Trans>}
                >
                  <TextInputField id="profile-email" name="email" />
                </SettingItem>
                <SettingItem
                  className="mt-8"
                  title={<Trans>Password</Trans>}
                  description={
                    <Trans>
                      <button
                        type="button"
                        className="text-action-primary"
                        onClick={() => setPasswordDialogOpen(true)}
                      >
                        Click to change password.
                      </button>{' '}
                      Secure your account with a strong password
                    </Trans>
                  }
                >
                  <PasswordPlaceholder className="text-disabled font-bold" />
                </SettingItem>
              </form>
            )}
          </Formik>
        </CardContent>
        <div className="p-4 flex border-t border-divider">
          <Button
            variation="primary"
            className="ml-auto"
            disabled={loading}
            type="submit"
            form="profile-settings-form"
          >
            {loading ? <CircularProgress /> : <Trans>Save profile</Trans>}
          </Button>
        </div>
      </Card>
    </>
  )
}

export default ProfileSettings
