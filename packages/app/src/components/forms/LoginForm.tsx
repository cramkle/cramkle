import { Trans, t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Button from '@material/react-button'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import { Headline4 } from '@material/react-typography'
import classNames from 'classnames'
import { Formik } from 'formik'
import React from 'react'
import { object, string } from 'yup'

import { TextInputField } from './Fields'

import styles from './LoginForm.scss'

interface LoginFormValues {
  username: string
  password: string
}

const LoginForm: React.FunctionComponent = () => (
  <I18n>
    {({ i18n }) => (
      <Formik<LoginFormValues>
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={object().shape({
          username: string()
            .matches(/^[a-zA-Z0-9_]+$/, i18n._(t`Invalid username`))
            .required(i18n._(t`Username is required`)),
          password: string().required(i18n._(t`Password is required`)),
        })}
        onSubmit={(values, props) => {
          return fetch('/_c/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(res => {
              if (!res.ok) {
                throw new Error(res.statusText)
              }
              return res.json()
            })
            .then(() => {
              window.location.assign('/')
            })
            .catch(() => {
              props.setErrors({
                password: i18n._(t`Invalid username and/or password`),
              })
            })
        }}
      >
        {({ isSubmitting, isValid, handleSubmit }) => (
          <form
            className={classNames(styles.loginForm, 'w-100')}
            onSubmit={handleSubmit}
          >
            <Card outlined>
              <div className="pa3 pb0 c-on-surface">
                <Headline4 className="tc">
                  <Trans>Login</Trans>
                </Headline4>

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
    )}
  </I18n>
)

export default LoginForm
