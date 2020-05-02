import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation, useParams } from 'react-router'
import * as yup from 'yup'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import { notificationState } from '../../notification'
import CircularProgress from '../views/CircularProgress'
import { Body1, Headline1 } from '../views/Typography'
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
  const { userId } = useParams<{ userId: string }>()
  const { search } = useLocation()
  const history = useHistory()
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

    const [timestamp, token] = urlParams.get('token').split('-')

    const {
      data: {
        resetPassword: { success },
      },
    } = await mutateResetPassword({
      variables: {
        token,
        timestamp,
        userId,
        newPassword,
      },
    })

    if (success) {
      notificationState.addNotification({
        message: t`Password changed successfully`,
      })

      history.push('/login')
    } else {
      notificationState.addNotification({
        message: t`Reset password token is expired`,
      })
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

      <div className="max-w-lg w-full bg-surface text-on-surface rounded px-4 py-6 border border-outline">
        <form onSubmit={handleSubmit}>
          <Headline1 className="text-2xl leading-normal ma-0 font-normal text-center">
            <Trans>Reset password</Trans>
          </Headline1>

          <Body1 className="my-4">
            <Trans>Choose a new password for your account.</Trans>
          </Body1>

          <label className="flex flex-col">
            <span className="text-sm">
              <Trans>
                New password
                <span
                  className={classnames({
                    'text-error': showPasswordError && !passwordValid,
                  })}
                >
                  *
                </span>
              </Trans>
            </span>
            <input
              className="mt-2 rounded border py-2 px-4 focus:border-primary"
              placeholder={i18n._(t`New password`)}
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordValidate}
              onFocus={handlePasswordFocus}
            />
            {showPasswordError && !passwordValid && (
              <span className="dib mt-1 text-error text-sm">
                <Trans>Your password must have a minimum length of 6</Trans>
              </span>
            )}
          </label>

          <label className="flex flex-col mt-3">
            <span className="text-sm">
              <Trans>Confirm password</Trans>
            </span>
            <input
              className="mt-2 rounded border py-2 px-4 focus:border-primary"
              placeholder={i18n._(t`Confirm password`)}
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => setShowConfirmPasswordError(true)}
              onFocus={() => setShowConfirmPasswordError(false)}
            />
            {showConfirmPasswordError && confirmPassword !== newPassword && (
              <span className="dib mt-1 text-error text-sm">
                <Trans>
                  The confirm password must be equal to the new password
                </Trans>
              </span>
            )}
          </label>

          <button
            className={classnames(
              'mt-6 border-0 rounded w-full h-10 py-1 px-2 text-center text-sm uppercase tracking-wide font-medium focus:shadow-outline',
              {
                'bg-primary text-on-primary': !loading,
                'bg-disabled text-disabled': loading,
              }
            )}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress /> : <Trans>Reset Password</Trans>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
