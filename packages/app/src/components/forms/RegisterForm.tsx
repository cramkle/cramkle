import { MessageDescriptor } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import { Headline5 } from '@material/react-typography'
import classNames from 'classnames'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import * as yup from 'yup'

import { TextInputField, CheckboxField } from './Fields'
import Button from '../views/Button'
import { notificationState } from '../../notification/index'

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

const RegisterForm: React.FunctionComponent<
  ChildMutateProps<Props> & RouteComponentProps
> = ({ mutate: register, title = t`Register`, history }) => {
  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        consent: false,
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
          .required(i18n._(t`Username is required`)),
        email: yup
          .string()
          .email()
          .required(i18n._(t`E-mail is required`)),
        password: yup
          .string()
          .min(6)
          .required(i18n._(t`Password is required`)),
        consent: yup
          .bool()
          .test(
            'consent',
            i18n._(t`Agreement is required`),
            value => value === true
          )
          .required(i18n._(t`Agreement is required`)),
      })}
      onSubmit={user =>
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
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="flex items-center">
              <CheckboxField name="consent" />
              <span className="ml2">
                <Trans>
                  I agree to the{' '}
                  <a href="/terms" target="_blank">
                    Terms & Conditions
                  </a>
                </Trans>
              </span>
            </label>
            <CardActions className="pa0 justify-end">
              <CardActionButtons className="w-100">
                <Button
                  className="w-100"
                  raised
                  disabled={!isValid || isSubmitting}
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

export default graphql<Props>(REGISTER_MUTATION)(withRouter(RegisterForm))
