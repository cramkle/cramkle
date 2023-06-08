'use client'

import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import * as yup from 'yup'

import PasswordPlaceholder from '@src/components/PasswordPlaceholder'
import SettingItem from '@src/components/SettingItem'
import UpdatePasswordDialog from '@src/components/UpdatePasswordDialog'
import { useCurrentUser } from '@src/components/UserContext'
import { TextInputField } from '@src/components/forms/Fields'
import { Button } from '@src/components/views/Button'
import { Card, CardContent } from '@src/components/views/Card'
import { CircularProgress } from '@src/components/views/CircularProgress'
import { pushSimpleToast } from '@src/toasts/pushToast'

import type {
  UpdateProfile,
  UpdateProfileVariables,
} from './__generated__/UpdateProfile'

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($email: String, $username: String, $password: String) {
    updateProfile(
      input: { email: $email, username: $username, password: $password }
    ) {
      user {
        id
        username
        email
        anonymous
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

export default function ProfileSettings() {
  const { i18n } = useLingui()
  const router = useRouter()

  const me = useCurrentUser()

  const { username, email } = me

  const [updateProfile, { loading }] = useMutation<
    UpdateProfile,
    UpdateProfileVariables
  >(UPDATE_PROFILE_MUTATION, { notifyOnNetworkStatusChange: true })

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  return (
    <>
      <UpdatePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
      <Card className="mt-4">
        <CardContent className="flex flex-col">
          {me.anonymous && (
            <p className="mb-4">
              <Trans>Complete your profile below.</Trans>
            </p>
          )}

          <Formik
            key={me.anonymous ? 1 : 0}
            initialValues={
              me.anonymous
                ? { username: '', email: '', password: '' }
                : { username, email }
            }
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
              ...(me.anonymous
                ? {
                    password: yup
                      .string()
                      .min(6, i18n._(t`Password must be at least 6 characters`))
                      .required(i18n._(t`Password is required`)),
                  }
                : null),
            })}
            onSubmit={(profile, helpers) => {
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

                router.refresh()
              })
            }}
          >
            {({ handleSubmit }) => (
              <form id="profile-settings-form" onSubmit={handleSubmit}>
                <SettingItem
                  id="profile-username"
                  title={<Trans>Username</Trans>}
                  description={
                    me.anonymous ? (
                      <Trans>Create an username for your account</Trans>
                    ) : (
                      <Trans>Change your account username</Trans>
                    )
                  }
                >
                  <TextInputField id="profile-username" name="username" />
                </SettingItem>
                <SettingItem
                  id="profile-email"
                  className="mt-8"
                  title={<Trans>Email</Trans>}
                  description={
                    me.anonymous ? (
                      <Trans>Fill the email for your account</Trans>
                    ) : (
                      <Trans>Update your account email</Trans>
                    )
                  }
                >
                  <TextInputField id="profile-email" name="email" />
                </SettingItem>
                {me.anonymous ? (
                  <SettingItem
                    id="profile-password"
                    className="mt-8"
                    title={<Trans>Password</Trans>}
                    description={
                      <Trans>Create a password for your account</Trans>
                    }
                  >
                    <TextInputField
                      id="profile-password"
                      name="password"
                      type="password"
                    />
                  </SettingItem>
                ) : (
                  <SettingItem
                    className="mt-8"
                    title={<Trans>Password</Trans>}
                    description={
                      <Trans>
                        <button
                          type="button"
                          className="text-primary"
                          onClick={() => setPasswordDialogOpen(true)}
                        >
                          Click to change password.
                        </button>{' '}
                        Secure your account with a strong password
                      </Trans>
                    }
                  >
                    <PasswordPlaceholder className="text-txt text-opacity-text-disabled font-bold" />
                  </SettingItem>
                )}
              </form>
            )}
          </Formik>
        </CardContent>
        <div className="p-4 flex border-t border-divider border-opacity-divider">
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
