import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Headline5 } from 'views/Typography'
import classNames from 'classnames'
import { Formik } from 'formik'
import React from 'react'
import { object, string } from 'yup'

import { TextInputField } from './Fields'
import Button from 'views/Button'
import Card, { CardActionButtons, CardActions } from 'views/Card'

import styles from './LoginForm.scss'

interface LoginFormValues {
  username: string
  password: string
}

const usernameRequired = t`Username is required`
const passwordRequired = t`Password is required`

const LoginForm: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <Formik<LoginFormValues>
      initialValues={{
        username: '',
        password: '',
      }}
      initialErrors={{
        username: i18n._(usernameRequired),
        password: i18n._(passwordRequired),
      }}
      validationSchema={object().shape({
        username: string()
          .matches(/^[a-zA-Z0-9_]+$/, i18n._(t`Invalid username`))
          .required(i18n._(usernameRequired)),
        password: string().required(i18n._(passwordRequired)),
      })}
      onSubmit={async (values, props) => {
        try {
          const res = await fetch('/_c/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })

          if (!res.ok) {
            throw new Error(res.statusText)
          }

          window.location.assign('/')
        } catch {
          props.setErrors({
            password: i18n._(t`Invalid username and/or password`),
          })
        }
      }}
    >
      {({ isSubmitting, isValid, handleSubmit }) => (
        <form
          className={classNames(styles.loginForm, 'w-100')}
          onSubmit={handleSubmit}
        >
          <Card outlined>
            <div className="pa3 pb0 c-on-surface">
              <Headline5 className="tc">
                <Trans>Login</Trans>
              </Headline5>

              <TextInputField
                className="w-100 mv2"
                id="username"
                name="username"
                label={i18n._(t`Username`)}
              />
              <TextInputField
                className="w-100 mv2"
                id="password"
                name="password"
                type="password"
                label={i18n._(t`Password`)}
              />
            </div>
            <CardActions className="justify-end pv0 ph3">
              <CardActionButtons className="w-100">
                <Button
                  className="w-100"
                  raised
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  data-testid="submit-btn"
                >
                  <Trans id="login.button">Login</Trans>
                </Button>
              </CardActionButtons>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default LoginForm
