import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { TextInputField } from './forms/Fields'
import Button from './views/Button'

const ModelNameForm: React.VFC<{
  name: string
  onSubmit: (name: string) => void
}> = ({ name: initialName, onSubmit }) => {
  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        name: initialName,
      }}
      validateOnBlur
      validationSchema={yup.object().shape({
        name: yup.string().required(i18n._(t`Name is required`)),
      })}
      onSubmit={(values) => {
        onSubmit(values.name)
      }}
    >
      <Form>
        <p className="mt-6 text-txt text-opacity-text-primary">
          <Trans>Create a name for your model.</Trans>
        </p>

        <TextInputField
          className="mt-4 max-w-md"
          name="name"
          label={i18n._(t`Model name`)}
        />

        <Button className="mt-6" variation="primary" type="submit">
          <Trans>Go to fields</Trans>
        </Button>
      </Form>
    </Formik>
  )
}

export default ModelNameForm
