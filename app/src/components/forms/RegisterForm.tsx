import { useMutation } from '@apollo/react-hooks'
import { MessageDescriptor } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import Button from 'views/Button'
import Card, { CardActionButtons, CardActions } from 'views/Card'
import FormField from 'views/FormField'
import { Headline5 } from 'views/Typography'
import * as yup from 'yup'

import { notificationState } from '../../notification/index'
import { CheckboxField, TextInputField } from './Fields'
import styles from './RegisterForm.scss'

interface Props {
  title?: MessageDescriptor | string
}

const REGISTER_MUTATION = gql`
  mutation RegisterUserMutation(
    $username: String!
    $email: String!
    $password: String!
  ) {
    createUser(username: $username, email: $email, password: $password) {
      id
    }
  }
`

const usernameRequired = t`Username is required`
const emailRequired = t`E-mail is required`
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
        consent: [],
      }}
      initialErrors={{
        username: i18n._(usernameRequired),
        email: i18n._(emailRequired),
        password: i18n._(passwordRequired),
      }}
      validationSchema={yup.object().shape({
        username: yup
          .string()
          .min(4)
          .max(20)
          .matches(
            /^[\w_]+$/,
            i18n._(
              t`Username must consist only of alphanumeric characters and underscores`
            )
          )
          .required(i18n._(usernameRequired)),
        email: yup.string().email().required(i18n._(emailRequired)),
        password: yup.string().min(6).required(i18n._(passwordRequired)),
        consent: yup
          .array(yup.string())
          .test(
            'consent',
            i18n._(agreementRequired),
            (value) => value.indexOf('on') !== -1
          )
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
        <form
          className={classNames(styles.form, 'w-100')}
          onSubmit={handleSubmit}
        >
          <Card
            className={classNames(styles.formContent, 'pa3 pb0 c-on-surface')}
            outlined
          >
            <Headline5 className="tc">{i18n._(title)}</Headline5>
            <TextInputField
              className="mv2"
              id="username"
              name="username"
              label={i18n._(t`Username`)}
            />
            <TextInputField
              className="mv2"
              id="email"
              name="email"
              label={i18n._(t`E-mail`)}
            />
            <TextInputField
              className="mv2"
              id="password"
              name="password"
              type="password"
              label={i18n._(t`Password`)}
            />
            <FormField
              input={
                <CheckboxField
                  name="consent"
                  value="on"
                  nativeControlId="consent-agreement"
                />
              }
              inputId="consent-agreement"
              label={
                <Trans>
                  I agree to the{' '}
                  <a href="/terms" target="_blank">
                    Terms & Conditions
                  </a>
                </Trans>
              }
            />
            <CardActions className="pa0 justify-end">
              <CardActionButtons className="w-100">
                <Button
                  className="w-100"
                  raised
                  disabled={!isValid || isSubmitting}
                  data-testid="register-submit-btn"
                >
                  <Trans>Register</Trans>
                </Button>
              </CardActionButtons>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default RegisterForm
