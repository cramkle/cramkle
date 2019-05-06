import { MessageDescriptor } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Button from '@material/react-button'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import { Headline5 } from '@material/react-typography'
import classNames from 'classnames'
import { Formik } from 'formik'
import React from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import * as yup from 'yup'

import registerMutation from '../../graphql/registerMutation.gql'
import { TextInputField, CheckboxField } from './Fields'

import styles from './RegisterForm.scss'

interface Props {
  title?: MessageDescriptor
}

const RegisterForm: React.FunctionComponent<
  ChildMutateProps<Props> & RouteComponentProps
> = ({ mutate: register, title = t`Register`, history }) => (
  <I18n>
    {({ i18n }) => (
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
          register({ variables: user }).then(() =>
            history.push('/login', { newUser: true })
          )
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
                name="username"
                label={i18n._(t`Username`)}
              />
              <TextInputField
                className="mv2"
                name="email"
                label={i18n._(t`E-mail`)}
              />
              <TextInputField
                className="mv2"
                label={i18n._(t`Password`)}
                name="password"
                type="password"
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
    )}
  </I18n>
)

export default graphql<Props>(registerMutation)(withRouter(RegisterForm))
