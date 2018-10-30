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
          <div className="login-page__form-content pa3 pb0">
            <h4 className="mdc-typography--headline4 login-page__form-title tc">
              Login
            </h4>

            <InputField
              className="login-page__form-input"
              name="username"
              label="Username"
              box
            />
            <InputField
              className="login-page__form-input"
              name="accessKey"
              type="password"
              label="Password"
              box
            />
            {errors.authentication &&
              !isSubmitting && (
                <p className="mdc-typography--subtitle2">
                  Invalid username and/or password
                </p>
              )}
          </div>
          <CardActions className="login-page__form-actions">
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
