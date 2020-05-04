import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router'
import * as yup from 'yup'

import { ReactComponent as Logo } from '../../assets/logo-white.svg'
import { notificationState } from '../../notification'
import CircularProgress from '../views/CircularProgress'
import { HelperText, Input, Label } from '../views/Input'
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
  const history = useHistory()
  const { state, pathname } = useLocation<{ showSuccess?: boolean }>()
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [showEmailError, setShowEmailError] = useState(false)

  const [mutateRequestPasswordReset, { loading, data }] = useMutation<
    RequestPasswordReset,
    RequestPasswordResetVariables
  >(REQUEST_PASSWORD_RESET_MUTATION)

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = async ({
    target: { value },
  }) => {
    setEmail(value)

    const isValid = await yup.string().email().required().isValid(value)

    setEmailValid(isValid)
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
    if (!emailValid) {
      setShowEmailError(true)
    }
  }

  const handleEmailFocus = () => {
    setShowEmailError(false)
  }

  useEffect(() => {
    if (!loading && data?.requestPasswordReset.success) {
      history.push(pathname, { showSuccess: true })
    }
  }, [data, history, loading, pathname])

  const handleGoToLogin = () => {
    history.push('/login')
  }

  let content = null

  if (state?.showSuccess) {
    content = (
      <>
        <div className="flex justify-center items-center">
          <svg
            className="text-success rounded-full border-2 border-success p-1"
            height="48"
            aria-hidden
            viewBox="0 0 24 24"
          >
            <path
              d="M1.73,12.91 8.1,19.28 20.79,6.59"
              strokeWidth="3"
              fill="none"
              stroke="currentColor"
            />
          </svg>
          <Headline1 className="ml-3 text-2xl leading-normal ma-0 font-normal">
            <Trans>Check your inbox!</Trans>
          </Headline1>
        </div>

        <Body1 className="mt-4">
          <Trans>
            We have sent you an email with instructions to help you reset your
            password. Remember to also check the spam folder.
          </Trans>
        </Body1>

        <button
          className={classnames(
            'mt-6 border-2 border-primary bg-surface text-action-primary rounded w-full h-10 py-1 px-2 text-center text-sm uppercase tracking-wide font-medium focus:shadow-outline'
          )}
          onClick={handleGoToLogin}
        >
          <Trans>Go to login</Trans>
        </button>
      </>
    )
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        <Headline1 className="text-2xl leading-normal ma-0 font-normal text-center">
          <Trans>Forgot password?</Trans>
        </Headline1>

        <Body1 className="my-4">
          <Trans>
            Enter the email associated with your account and we will send a link
            to reset your password
          </Trans>
        </Body1>

        <Label
          text={
            <>
              <Trans>Email address</Trans>
              <span
                className={classnames({
                  'text-error': showEmailError && !emailValid,
                })}
              >
                *
              </span>
            </>
          }
        >
          <Input
            placeholder={i18n._(t`Enter your email address`)}
            type="text"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailValidate}
            onFocus={handleEmailFocus}
          />
          {showEmailError && !emailValid && (
            <HelperText variation="error">
              <Trans>Invalid email</Trans>
            </HelperText>
          )}
        </Label>

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
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary text-on-primary">
      <Helmet>
        <title>{i18n._(t`Forgot password`)}</title>
      </Helmet>

      <Logo className="w-16 mb-8" />

      <div className="max-w-lg bg-surface text-on-surface rounded px-4 py-6 border border-outline">
        {content}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
