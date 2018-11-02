import React from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'

import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'

import InputField from './InputField'

const LoginForm = () => (
  <Formik
    initialValues={{
      username: '',
      accessKey: '',
      // so typescript doesn't complain
      authentication: '',
    }}
    validationSchema={object().shape({
      username: string()
        .matches(/^[a-zA-Z0-9_]+$/, 'Invalid username')
        .required('Username is required'),
      accessKey: string().required('Password is required'),
    })}
    onSubmit={() => {}}
  >
    {({ isSubmitting, isValid, handleSubmit, errors }) => (
      <form className="login-page__form w-100" onSubmit={handleSubmit}>
        <Card>
          <div className="pa3 pb0 c-on-surface">
            <h4 className="mdc-typography--headline4 tc">
              Login
            </h4>

            <InputField
              className="w-100 mv2"
              name="username"
              label="Username"
            />
            <InputField
              className="w-100 mv2"
              name="accessKey"
              type="password"
              label="Password"
            />
            {errors.authentication &&
              !isSubmitting && (
                <p className="mdc-typography--subtitle2">
                  Invalid username and/or password
                </p>
              )}
          </div>
          <CardActions>
            <CardActionButtons>
              <Button raised disabled={!isValid || isSubmitting}>
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
