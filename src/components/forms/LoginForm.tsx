import classNames from 'classnames'
import React from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'

import { Headline4 } from '@material/react-typography'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'

import { TextInputField } from './Fields'

import styles from './LoginForm.scss'

interface LoginFormValues {
  username: string
  password: string
}

const LoginForm: React.FunctionComponent = () => (
  <Formik<LoginFormValues>
    initialValues={{
      username: '',
      password: '',
    }}
    validationSchema={object().shape({
      username: string()
        .matches(/^[a-zA-Z0-9_]+$/, 'Invalid username')
        .required('Username is required'),
      password: string().required('Password is required'),
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
            password: 'Invalid username and/or password',
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
            <Headline4 className="tc">Login</Headline4>

            <TextInputField
              className="w-100 mv2"
              id="username"
              name="username"
              label="Username"
            />
            <TextInputField
              className="w-100 mv2"
              id="password"
              name="password"
              type="password"
              label="Password"
            />
          </div>
          <CardActions>
            <CardActionButtons>
              <Button
                raised
                disabled={!isValid || isSubmitting}
                type="submit"
                data-testid="submit-btn"
              >
                Login
              </Button>
            </CardActionButtons>
          </CardActions>
        </Card>
      </form>
    )}
  </Formik>
)

export default LoginForm
