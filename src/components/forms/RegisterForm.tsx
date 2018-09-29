import * as React from 'react'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import { string, object } from 'yup'

import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'

import InputField from './InputField'
import { registerNewUser } from '../../actions/user'

interface RegisterFormProps {
  register: () => {}
  title?: string
}

const RegisterForm: React.StatelessComponent<RegisterFormProps> = ({ register, title }) => (
  <Formik
    initialValues={{
      username: '',
      email: '',
      accessKey: '',
    }}
    validationSchema={object().shape({
      username: string()
        .min(4)
        .max(20)
        .matches(
          /^[\w_]+$/,
          'Username must consist only of alphanumeric characters and underscores'
        )
        .required('Username is required'),
      email: string()
        .email()
        .required('Email is required'),
      accessKey: string()
        .min(6)
        .required('Password is required'),
    })}
    onSubmit={register}
  >
    {({ handleSubmit, isValid, isSubmitting }) => (
      <form className="register-page__form" onSubmit={handleSubmit}>
        <Card className="register-page__form-content">
          <h4 className="mdc-typography--headline4 register-page__form-title">
            {title}
          </h4>
          <InputField name="username" label="Username" box />
          <InputField name="email" label="Email" box />
          <InputField label="Password" name="accessKey" type="password" box />
          <CardActions>
            <CardActionButtons>
              <Button raised disabled={!isValid || isSubmitting}>
                Register
              </Button>
            </CardActionButtons>
          </CardActions>
        </Card>
      </form>
    )}
  </Formik>
)

RegisterForm.defaultProps = {
  title: 'Register',
}

export default connect(
  null,
  { register: registerNewUser }
)(RegisterForm)
