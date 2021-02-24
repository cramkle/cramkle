import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { FieldArray, Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { TextInputField } from './forms/Fields'
import { BackArrowIcon } from './icons/BackArrowIcon'
import { TrashBinIcon } from './icons/TrashBinIcon'
import { Button } from './views/Button'
import { Headline2 } from './views/Typography'

const ModelFieldsForm: React.VFC<{
  fields: { name: string }[]
  onSubmit: (fields: { name: string }[]) => void
  onGoBack: () => void
}> = ({ fields: initialFields, onSubmit, onGoBack }) => {
  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        fields: initialFields,
      }}
      validationSchema={yup.object().shape({
        fields: yup.array(
          yup.object().shape({
            name: yup.string().required(i18n._(t`Field name is required`)),
          })
        ),
      })}
      onSubmit={(values) => {
        onSubmit(values.fields)
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="fields" validateOnChange={false}>
            {({ push, remove }) => (
              <div className="mt-4">
                <Button size="small" type="button" onClick={onGoBack}>
                  <BackArrowIcon />
                </Button>

                <div className="mt-6 flex items-center">
                  <Headline2 className="text-txt text-opacity-text-primary">
                    <Trans>Fields</Trans>
                  </Headline2>
                  <Button
                    type="button"
                    className="ml-6"
                    size="small"
                    onClick={() => push({ name: '' })}
                  >
                    <Trans>Add field</Trans>
                  </Button>
                </div>

                <p className="mt-6 max-w-prose text-txt text-opacity-text-primary">
                  <Trans>
                    A model consist of both fields and templates. A field is
                    used in a note to fill values that are used inside the
                    template.
                  </Trans>
                </p>

                <div className="mt-6 flex flex-col">
                  {values.fields.map((_, index) => (
                    <div
                      className={classnames('flex', {
                        'mt-4': index > 0,
                      })}
                      key={index}
                    >
                      <div className="flex items-center flex-shrink-0 justify-center h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary mt-7 text-sm md:text-base text-txt text-opacity-text-primary">
                        {index + 1}
                      </div>

                      <div className="ml-4 flex min-w-0">
                        <TextInputField
                          className="min-w-0 w-full"
                          name={`fields.${index}.name`}
                          label={i18n._(t`Field name`)}
                        />

                        <Button
                          type="button"
                          variation="outline"
                          className="ml-3 text-primary mt-7"
                          onClick={() => remove(index)}
                          disabled={values.fields.length <= 1}
                          aria-label={i18n._(t`Remove field`)}
                        >
                          <TrashBinIcon />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FieldArray>

          <Button className="mt-6" variation="primary" type="submit">
            <Trans>Go to templates</Trans>
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default ModelFieldsForm
