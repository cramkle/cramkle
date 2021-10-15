import { gql, useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import type { Location } from 'history'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router'
import * as yup from 'yup'

import { LogoCircle } from '../components/LogoCircle'
import { DoneIcon } from '../components/icons/DoneIcon'
import { Button } from '../components/views/Button'
import { Card, CardContent } from '../components/views/Card'
import { CircularProgress } from '../components/views/CircularProgress'
import { HelperText, Input, Label } from '../components/views/Input'
import { Body1, Headline2 } from '../components/views/Typography'
import {
  TIMEOUT_MEDIUM,
  pushErrorToast,
  pushSimpleToast,
} from '../toasts/pushToast'
import type {
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
  const navigate = useNavigate()
  const { state, pathname } = useLocation() as Location<{
    showSuccess?: boolean
  }>
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

    const { data } = await mutateRequestPasswordReset({
      variables: { email },
    })

    const success = data?.requestPasswordReset?.success

    if (success) {
      pushSimpleToast(t`Email sent!`)
    } else {
      pushErrorToast(
        {
          message: t`User not found`,
        },
        TIMEOUT_MEDIUM
      )
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
    if (!loading && data?.requestPasswordReset?.success) {
      navigate(pathname, { state: { showSuccess: true } })
    }
  }, [data, navigate, loading, pathname])

  const handleGoToLogin = () => {
    navigate('/login')
  }

  let content = null

  if (state?.showSuccess) {
    content = (
      <>
        <div className="flex justify-center items-center">
          <DoneIcon className="h-10 w-10 text-green-1 rounded-full border-2 border-green-1 p-2" />
          <Headline2 className="ml-3 ma-0">
            <Trans>Check your inbox!</Trans>
          </Headline2>
        </div>

        <Body1 className="mt-4">
          <Trans>
            We have sent you an email with instructions to help you reset your
            password. Remember to also check the spam folder.
          </Trans>
        </Body1>

        <Button
          className="mt-6 w-full"
          variation="outline"
          onClick={handleGoToLogin}
        >
          <Trans>Go to login</Trans>
        </Button>
      </>
    )
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        <Headline2 className="ma-0 text-center">
          <Trans>Forgot password?</Trans>
        </Headline2>

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
                  'text-red-1': showEmailError && !emailValid,
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

        <Button
          variation="primary"
          className="mt-6 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Trans>Request Password Reset</Trans>
          )}
        </Button>
      </form>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary-dark text-on-primary">
      <Helmet>
        <title>{i18n._(t`Forgot password`)}</title>
      </Helmet>

      <LogoCircle className="w-16 mb-8" />

      <Card className="max-w-lg">
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
