import { useMutation } from '@apollo/react-hooks'
import { MessageDescriptor } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import { pushSimpleToast } from '../../toasts/pushToast'
import Button from '../views/Button'
import { Card, CardContent } from '../views/Card'
import CircularProgress from '../views/CircularProgress'
import { Headline2 } from '../views/Typography'
import { CheckboxField, TextInputField } from './Fields'
import {
  RegisterUser,
  RegisterUserVariables,
} from './__generated__/RegisterUser'

interface Props {
  title?: MessageDescriptor | string
}

const REGISTER_MUTATION = gql`
  mutation RegisterUser(
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

const usernameRequired = t`Username is required`
const emailRequired = t`Email is required`
const passwordRequired = t`Password is required`
const agreementRequired = t`Agreement is required`

const RegisterForm: React.FunctionComponent<Props> = ({
  title = t`Register`,
}) => {
  const navigate = useNavigate()
  const [register] = useMutation<RegisterUser, RegisterUserVariables>(
    REGISTER_MUTATION
  )
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
      onSubmit={(user, helpers) => {
        if (!helpers.validateForm(user)) {
          return
        }

        return register({ variables: user }).then((mutationResult) => {
          if (
            mutationResult.errors ||
            mutationResult.data?.createUser == null
          ) {
            pushSimpleToast(t`An unknown error has occurred`)
            return
          }

          if (mutationResult.data.createUser.error != null) {
            if (!mutationResult.data.createUser.error.fields) {
              pushSimpleToast(t`An unknown error has occurred`)
              return
            }

            const formErrors = Object.fromEntries(
              mutationResult.data.createUser.error.fields.map(
                ({ fieldName, errorDescription }) => [
                  fieldName,
                  errorDescription,
                ]
              )
            )
            helpers.setErrors(formErrors)
            return
          }

          pushSimpleToast(t`Account created successfully`)

          navigate('/login')
        })
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form
          className="w-full max-w-md"
          method="post"
          onSubmit={handleSubmit}
          noValidate
        >
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
                disabled={isSubmitting}
                data-testid="register-submit-btn"
                variation="primary"
              >
                {isSubmitting ? <CircularProgress /> : <Trans>Register</Trans>}
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default RegisterForm
