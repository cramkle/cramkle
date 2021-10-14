import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import { useEffect } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate, useParams } from 'react-router'
import * as yup from 'yup'

import { LogoCircle } from '../components/LogoCircle'
import { TextInputField } from '../components/forms/Fields'
import { Button } from '../components/views/Button'
import { Card, CardContent } from '../components/views/Card'
import { CircularProgress } from '../components/views/CircularProgress'
import { Body1, Headline2 } from '../components/views/Typography'
import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushSimpleToast,
} from '../toasts/pushToast'
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

const ResetPasswordPage: React.VFC = () => {
  const { i18n } = useLingui()
  const { userId } = useParams() as { userId: string }
  const { search } = useLocation()
  const navigate = useNavigate()
  const [mutateResetPassword, { loading }] = useMutation<
    ResetPassword,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  useEffect(() => {
    const urlParams = new URLSearchParams(search)

    if (!urlParams.has('token')) {
      navigate('/login')
    }
  }, [search, navigate])

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary-dark text-on-primary">
      <Helmet>
        <title>{i18n._(t`Reset password`)}</title>
      </Helmet>

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

                navigate('/login')
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

export default ResetPasswordPage
