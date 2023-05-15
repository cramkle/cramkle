'use client'

import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import * as React from 'react'
import * as yup from 'yup'

import { LogoCircle } from '@src/components/LogoCircle'
import { TextInputField } from '@src/components/forms/Fields'
import { Button } from '@src/components/views/Button'
import { Card, CardContent } from '@src/components/views/Card'
import { CircularProgress } from '@src/components/views/CircularProgress'
import { Body1, Headline2 } from '@src/components/views/Typography'
import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushSimpleToast,
} from '@src/toasts/pushToast'

import type {
  ResetPassword,
  ResetPasswordVariables,
} from './__generated__/ResetPassword'

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $userId: ID!
    $token: String!
    $timestamp: String!
    $newPassword: String!
  ) {
    resetPassword(
      input: {
        userId: $userId
        token: $token
        timestamp: $timestamp
        newPassword: $newPassword
      }
    ) {
      success
    }
  }
`

export default function ResetPasswordPage() {
  const { i18n } = useLingui()
  const { userId } = useParams()
  const search = useSearchParams()
  const router = useRouter()
  const [mutateResetPassword, { loading }] = useMutation<
    ResetPassword,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  useEffect(() => {
    if (!search.has('token')) {
      router.push('/login')
    }
  }, [search, router])

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary-dark text-on-primary">
      <LogoCircle className="w-16 mb-8" />

      <Card className="max-w-lg w-full">
        <CardContent>
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={yup.object().shape({
              newPassword: yup
                .string()
                .min(6, i18n._(t`Password must be at least 6 characters`))
                .required(i18n._(t`New password is required`)),
              confirmPassword: yup
                .string()
                .when('newPassword', {
                  is: (val: string) => !!val,
                  then: yup
                    .string()
                    .oneOf(
                      [yup.ref('newPassword')],
                      i18n._(
                        t`Confirm password must be equal to the new password`
                      )
                    ),
                })
                .required(i18n._(t`Confirm password is required`)),
            })}
            onSubmit={async (values) => {
              const urlParams = new URLSearchParams(search)

              const timestamp = urlParams.get('token')?.split('-')[0] ?? ''
              const token = urlParams.get('token')?.split('-')[1] ?? ''

              const { data } = await mutateResetPassword({
                variables: {
                  token,
                  timestamp,
                  userId,
                  newPassword: values.newPassword,
                },
              })

              const success = data?.resetPassword?.success

              if (success) {
                pushSimpleToast(t`Password changed successfully`)

                router.push('/login')
              } else {
                pushErrorToast(
                  {
                    message: t`Reset password token is expired`,
                  },
                  TIMEOUT_MEDIUM
                )
              }
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Headline2 className="ma-0 text-center">
                  <Trans>Reset password</Trans>
                </Headline2>

                <Body1 className="mt-4">
                  <Trans>Choose a new password for your account.</Trans>
                </Body1>

                <TextInputField
                  className="mt-6"
                  id="newPassword"
                  name="newPassword"
                  label={i18n._(t`New password`)}
                  type="password"
                />
                <TextInputField
                  className="mt-3"
                  id="confirmPassword"
                  name="confirmPassword"
                  label={i18n._(t`Confirm password`)}
                  type="password"
                />

                <Button
                  variation="primary"
                  className="mt-6 w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Trans>Reset Password</Trans>
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
