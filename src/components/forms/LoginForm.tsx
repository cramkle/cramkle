import React from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'

import { Headline4, Subtitle2 } from '@material/react-typography'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'

import InputField from './InputField'

interface LoginFormValues {
  username: string
  password: string
  authentication?: boolean
}

class FormikLogin extends Formik<LoginFormValues> {}

const LoginForm: React.FunctionComponent = () => (
  <FormikLogin
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
    onSubmit={(values, props) =>
      fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then(res => res.json())
        .then(() => {
          window.location.assign('/dashboard')
        })
        .catch(e => {
          console.error(e)
          props.setErrors({
            authentication: '',
          })
          props.setSubmitting(false)
        })
    }
  >
    {({ isSubmitting, isValid, handleSubmit, errors }) => (
      <form className="login-page__form w-100" onSubmit={handleSubmit}>
        <Card>
          <div className="pa3 pb0 c-on-surface">
            <Headline4 className="tc">Login</Headline4>

            <InputField
              className="w-100 mv2"
              name="username"
              label="Username"
            />
            <InputField
              className="w-100 mv2"
              name="password"
              type="password"
              label="Password"
            />
            {errors.authentication && !isSubmitting && (
              <Subtitle2>Invalid username and/or password</Subtitle2>
            )}
          </div>
          <CardActions>
            <CardActionButtons>
              <Button raised disabled={!isValid || isSubmitting} type="submit">
                Login
              </Button>
            </CardActionButtons>
          </CardActions>
        </Card>
      </form>
    )}
  </FormikLogin>
)

export default LoginForm
