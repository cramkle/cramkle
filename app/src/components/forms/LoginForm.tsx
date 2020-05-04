import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { Formik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import { object, string } from 'yup'

import Button from '../views/Button'
import Card, { CardActionButtons, CardActions } from '../views/Card'
import { Headline5 } from '../views/Typography'
import { TextInputField } from './Fields'
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
          .matches(/^[\w\d_]+$/, i18n._(t`Invalid username`))
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
          className={classNames(styles.loginForm, 'w-full')}
          onSubmit={handleSubmit}
        >
          <Card outlined>
            <div className="p-4 pb-0 text-on-surface">
              <Headline5 className="text-center">
                <Trans>Login</Trans>
              </Headline5>

              <TextInputField
                className="w-full my-2"
                id="username"
                name="username"
                label={i18n._(t`Username`)}
              />
              <TextInputField
                className="w-full my-2"
                id="password"
                name="password"
                type="password"
                label={i18n._(t`Password`)}
              />
            </div>
            <CardActions className="px-4 flex flex-col items-start">
              <Link
                className="text-on-surface hover:underline"
                to="/forgot-password"
              >
                <Trans>Forgot your password?</Trans>
              </Link>
              <CardActionButtons className="w-full mt-3">
                <Button
                  className="w-full"
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
