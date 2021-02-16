import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Formik } from 'formik'
import * as React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { object, string } from 'yup'

import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import { Headline2 } from '../views/Typography'
import { TextInputField } from './Fields'

interface LoginFormValues {
  username: string
  password: string
}

const usernameRequired = t`Username is required`
const passwordRequired = t`Password is required`

const LoginForm: React.FunctionComponent = () => {
  const { i18n } = useLingui()
  const [searchParams] = useSearchParams()

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
      onSubmit={async (values, helpers) => {
        if (!(await helpers.validateForm(values))) {
          return
        }

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

          window.location.assign(
            searchParams.has('returnUrl') ? searchParams.get('returnUrl')! : '/'
          )
        } catch {
          helpers.setErrors({
            password: i18n._(t`Invalid username and/or password`),
          })
        }
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Headline2 className="text-center">
            <Trans>Login</Trans>
          </Headline2>

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
          <Link className="text-primary hover:underline" to="/forgot-password">
            <Trans>Forgot your password?</Trans>
          </Link>

          <Button
            variation="primary"
            className="w-full mt-3"
            disabled={isSubmitting}
            type="submit"
            data-testid="submit-btn"
          >
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              <Trans id="login.button">Login</Trans>
            )}
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default LoginForm
