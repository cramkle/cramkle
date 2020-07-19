import { useMutation } from '@apollo/react-hooks'
import { MessageDescriptor } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import { notificationState } from '../../notification/index'
import Button from '../views/Button'
import { Card, CardContent } from '../views/Card'
import { Headline2 } from '../views/Typography'
import { CheckboxField, TextInputField } from './Fields'

interface Props {
  title?: MessageDescriptor | string
}

const REGISTER_MUTATION = gql`
  mutation RegisterUserMutation(
    $username: String!
    $email: String!
    $password: String!
    $zoneInfo: String
  ) {
    createUser(
      input: {
        username: $username
        email: $email
        password: $password
        zoneInfo: $zoneInfo
      }
    ) {
      user {
        id
      }
    }
  }
`

const usernameRequired = t`Username is required`
const emailRequired = t`Email is required`
const passwordRequired = t`Password is required`
const agreementRequired = t`Agreement is required`

const RegisterForm: React.FunctionComponent<Props> = ({
  title = t`Register`,
}) => {
  const history = useHistory()
  const [register] = useMutation(REGISTER_MUTATION)
  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        zoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
        consent: false,
      }}
      initialErrors={{
        username: i18n._(usernameRequired),
        email: i18n._(emailRequired),
        password: i18n._(passwordRequired),
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
          .required(i18n._(usernameRequired)),
        email: yup
          .string()
          .email(i18n._(t`Email must be a valid email`))
          .required(i18n._(emailRequired)),
        password: yup
          .string()
          .min(6, i18n._(t`Password must be at least 6 characters`))
          .required(i18n._(passwordRequired)),
        consent: yup
          .bool()
          .test('consent', i18n._(agreementRequired), (value) => value === true)
          .required(i18n._(agreementRequired)),
      })}
      onSubmit={(user) =>
        register({ variables: user }).then(() => {
          notificationState.addNotification({
            message: t`Account created successfully`,
            actionText: t`Dismiss`,
          })

          history.push('/login')
        })
      }
    >
      {({ handleSubmit, isValid, isSubmitting }) => (
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <Card className="pb-2">
            <CardContent>
              <Headline2 className="text-center">{i18n._(title)}</Headline2>
              <TextInputField
                className="my-2"
                id="username"
                name="username"
                label={i18n._(t`Username`)}
              />
              <TextInputField
                className="my-2"
                id="email"
                name="email"
                label={i18n._(t`Email`)}
              />
              <TextInputField
                className="my-2"
                id="password"
                name="password"
                type="password"
                label={i18n._(t`Password`)}
              />
              <div className="flex">
                <CheckboxField name="consent">
                  <Trans>
                    I agree to the{' '}
                    <Link
                      className="text-action-primary hover:underline"
                      to="/terms"
                      target="_blank"
                    >
                      Terms & Conditions
                    </Link>
                  </Trans>
                </CheckboxField>
              </div>
              <Button
                className="w-full mt-3"
                disabled={!isValid || isSubmitting}
                data-testid="register-submit-btn"
                variation="primary"
              >
                <Trans>Register</Trans>
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default RegisterForm
