import React from 'react'
import { Formik } from 'formik'
import { string, object } from 'yup'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'
import { Headline4 } from '@material/react-typography'

import registerMutation from '../../graphql/registerMutation.gql'
import InputField from './InputField'

interface Props {
  title?: string
}

const RegisterForm: React.FunctionComponent<
  ChildMutateProps<Props> & RouteComponentProps
> = ({ mutate: register, title, history }) => (
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
      password: string()
        .min(6)
        .required('Password is required'),
    })}
    onSubmit={user =>
      register({ variables: user }).then(() => history.push('/login'))
    }
  >
    {({ handleSubmit, isValid, isSubmitting }) => (
      <form className="register-page__form w-100" onSubmit={handleSubmit}>
        <Card className="register-page__form-content pa3 pb0 c-on-surface">
          <Headline4 className="tc">{title}</Headline4>
          <InputField className="mv2" name="username" label="Username" />
          <InputField className="mv2" name="email" label="Email" />
          <InputField
            className="mv2"
            label="Password"
            name="password"
            type="password"
          />
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

export default graphql<Props>(registerMutation)(withRouter(RegisterForm))
