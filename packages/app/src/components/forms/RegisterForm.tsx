import classNames from 'classnames'
import { Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { graphql, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'
import { Headline4 } from '@material/react-typography'

import registerMutation from '../../graphql/registerMutation.gql'
import { TextInputField, CheckboxField } from './Fields'

import styles from './RegisterForm.scss'

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
          'Username must consist only of alphanumeric characters and underscores'
        )
        .required('Username is required'),
      email: yup
        .string()
        .email()
        .required('E-mail is required'),
      password: yup
        .string()
        .min(6)
        .required('Password is required'),
      consent: yup
        .bool()
        .test('consent', 'Agreement is required', value => value === true)
        .required('Agreement is required'),
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
          <Headline4 className="tc f3 f2-ns">{title}</Headline4>
          <TextInputField className="mv2" name="username" label="Username" />
          <TextInputField className="mv2" name="email" label="E-mail" />
          <TextInputField
            className="mv2"
            label="Password"
            name="password"
            type="password"
          />
          <label className="flex items-center">
            <CheckboxField name="consent" />
            <span className="ml2">
              I agree to the {/* eslint-disable-next-line */}
              <a href="#" target="_blank">
                Terms & Conditions
              </a>
            </span>
          </label>
          <CardActions className="pa0 justify-end">
            <CardActionButtons className="w-100">
              <Button
                className="w-100"
                raised
                disabled={!isValid || isSubmitting}
              >
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
