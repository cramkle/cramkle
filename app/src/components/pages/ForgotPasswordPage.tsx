import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import * as yup from 'yup'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import { notificationState } from '../../notification'
import CircularProgress from '../views/CircularProgress'
import { Body1, Headline1 } from '../views/Typography'
import {
  RequestPasswordReset,
  RequestPasswordResetVariables,
} from './__generated__/RequestPasswordReset'

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      success
    }
  }
`

const ForgotPasswordPage: React.FC = () => {
  const { i18n } = useLingui()
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [showEmailError, setShowEmailError] = useState(false)

  const [mutateRequestPasswordReset, { loading }] = useMutation<
    RequestPasswordReset,
    RequestPasswordResetVariables
  >(REQUEST_PASSWORD_RESET_MUTATION)

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setEmail(value)
  }

  const handleSubmit: React.FormEventHandler = async (evt) => {
    evt.preventDefault()

    if (!emailValid) {
      return
    }

    const {
      data: {
        requestPasswordReset: { success },
      },
    } = await mutateRequestPasswordReset({
      variables: { email },
    })

    if (success) {
      notificationState.addNotification({
        message: t`Email sent!`,
      })
    } else {
      notificationState.addNotification({
        message: t`User not found`,
      })
    }
  }

  const handleEmailValidate = async () => {
    const isValid = await yup.string().email().required().isValid(email)

    setEmailValid(isValid)

    if (!isValid) {
      setShowEmailError(true)
    }
  }

  const handleEmailFocus = () => {
    setShowEmailError(false)
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary text-on-primary">
      <Helmet>
        <title>{i18n._(t`Forgot password`)}</title>
      </Helmet>

      <Logo className="w-16 mb-8" />

      <div className="max-w-lg bg-surface text-on-surface rounded px-4 py-6 border border-outline">
        <form onSubmit={handleSubmit}>
          <Headline1 className="text-2xl leading-normal ma-0 font-normal text-center">
            <Trans>Forgot password?</Trans>
          </Headline1>

          <Body1 className="my-4">
            <Trans>
              Enter the email associated with your account and we will send a
              link to reset your password
            </Trans>
          </Body1>

          <label className="flex flex-col">
            <span className="text-sm">
              <Trans>
                E-mail address
                <span
                  className={classnames({
                    'text-error': showEmailError && !emailValid,
                  })}
                >
                  *
                </span>
              </Trans>
            </span>
            <input
              className="mt-2 rounded border py-2 px-4 focus:border-primary"
              placeholder={i18n._(t`Enter your e-mail address`)}
              type="text"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailValidate}
              onFocus={handleEmailFocus}
            />
            {showEmailError && !emailValid && (
              <span className="dib mt-1 text-error text-sm">
                <Trans>Invalid e-mail</Trans>
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
            {loading ? (
              <CircularProgress />
            ) : (
              <Trans>Request Password Reset</Trans>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
