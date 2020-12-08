import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'
import { useState } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate, useParams } from 'react-router'
import * as yup from 'yup'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushSimpleToast,
} from '../../toasts/pushToast'
import Button from '../views/Button'
import { Card, CardContent } from '../views/Card'
import CircularProgress from '../views/CircularProgress'
import { HelperText, Input, Label } from '../views/Input'
import { Body1, Headline2 } from '../views/Typography'
import {
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

const ResetPasswordPage: React.FC = () => {
  const { i18n } = useLingui()
  const { userId } = useParams() as { userId: string }
  const { search } = useLocation()
  const navigate = useNavigate()
  const [mutateResetPassword, { loading }] = useMutation<
    ResetPassword,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  const [newPassword, setNewPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(
    false
  )

  const handleSubmit: React.FormEventHandler = async (evt) => {
    evt.preventDefault()

    if (!passwordValid || confirmPassword !== newPassword) {
      setShowPasswordError(true)
      setShowConfirmPasswordError(true)

      return
    }

    const urlParams = new URLSearchParams(search)

    const [timestamp, token] = urlParams.get('token')?.split('-') ?? ['', '']

    const { data } = await mutateResetPassword({
      variables: {
        token,
        timestamp,
        userId,
        newPassword,
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
  }

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setNewPassword(evt.target.value)
  }

  const handleConfirmPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setConfirmPassword(evt.target.value)
  }

  const handlePasswordValidate = async () => {
    const isValid = await yup.string().min(6).required().isValid(newPassword)

    setPasswordValid(isValid)

    if (!isValid) {
      setShowPasswordError(true)
    }
  }

  const handlePasswordFocus = () => {
    setShowPasswordError(false)
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary text-on-primary">
      <Helmet>
        <title>{i18n._(t`Reset password`)}</title>
      </Helmet>

      <Logo className="w-16 mb-8" />

      <Card className="max-w-lg w-full">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Headline2 className="ma-0 text-center">
              <Trans>Reset password</Trans>
            </Headline2>

            <Body1 className="my-4">
              <Trans>Choose a new password for your account.</Trans>
            </Body1>

            <Label
              text={
                <>
                  <Trans>New password</Trans>
                  <span
                    className={classnames({
                      'text-red-1': showPasswordError && !passwordValid,
                    })}
                  >
                    *
                  </span>
                </>
              }
            >
              <Input
                placeholder={i18n._(t`New password`)}
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordValidate}
                onFocus={handlePasswordFocus}
              />
              {showPasswordError && !passwordValid && (
                <HelperText variation="error">
                  <Trans>Password must be at least 6 characters</Trans>
                </HelperText>
              )}
            </Label>

            <Label text={<Trans>Confirm password</Trans>}>
              <Input
                placeholder={i18n._(t`Confirm password`)}
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => setShowConfirmPasswordError(true)}
                onFocus={() => setShowConfirmPasswordError(false)}
              />
              {showConfirmPasswordError && confirmPassword !== newPassword && (
                <HelperText variation="error">
                  <Trans>
                    Confirm password must be equal to the new password
                  </Trans>
                </HelperText>
              )}
            </Label>

            <Button
              variation="primary"
              className="mt-6 w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress /> : <Trans>Reset Password</Trans>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
