import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { FieldArray, Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { TextInputField } from './forms/Fields'
import { BackArrowIcon } from './icons/BackArrowIcon'
import { TrashBinIcon } from './icons/TrashBinIcon'
import { Alert } from './views/Alert'
import { Button } from './views/Button'
import { Headline2 } from './views/Typography'

const ModelTemplatesForm: React.VFC<{
  templates: { name: string }[]
  isSubmitting: boolean
  onGoBack: () => void
  onSubmit: (templates: { name: string }[]) => void
  hasError: boolean
}> = ({
  templates: initialTemplates,
  hasError,
  onSubmit,
  isSubmitting,
  onGoBack,
}) => {
  const { i18n } = useLingui()

  return (
    <Formik
      initialValues={{
        templates: initialTemplates,
      }}
      validationSchema={yup.object().shape({
        templates: yup.array(
          yup.object().shape({
            name: yup.string().required(i18n._(t`Template name is required`)),
          })
        ),
      })}
      onSubmit={(values) => {
        onSubmit(values.templates)
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col">
          <FieldArray name="templates" validateOnChange={false}>
            {({ push, remove }) => (
              <div className="mt-4 sm:pr-4">
                <Button type="button" size="small" onClick={onGoBack}>
                  <BackArrowIcon />
                </Button>

                <div className="mt-6 flex items-center">
                  <Headline2 className="text-txt text-opacity-text-primary">
                    <Trans>Templates</Trans>
                  </Headline2>

                  <Button
                    size="small"
                    className="ml-6"
                    onClick={() => push({ name: '' })}
                    type="button"
                  >
                    <Trans>Add template</Trans>
                  </Button>
                </div>

                <p className="mt-6 max-w-prose text-txt text-opacity-text-primary">
                  <Trans>
                    The templates are used to define the frontside and backside
                    of each flashcard, using the fields defined in the previous
                    step. You'll be able to edit the template's content after
                    creating the model.
                  </Trans>
                </p>

                <p className="mt-6 max-w-prose text-txt text-opacity-text-primary">
                  <Trans>
                    When you create a note, we will create the corresponding
                    number of flashcards based on how much templates the note's
                    model has, and will use the note's values to fill in the
                    template.
                  </Trans>
                </p>

                <div className="mt-6 flex flex-col">
                  {values.templates.map((_, index) => (
                    <div
                      className={classnames('flex', {
                        'mt-4': index > 0,
                      })}
                      key={index}
                    >
                      <div className="flex items-center flex-shrink-0 justify-center h-10 w-10 rounded-full bg-secondary mt-7 text-txt text-opacity-text-primary">
                        {index + 1}
                      </div>

                      <div className="ml-4 flex min-w-0">
                        <TextInputField
                          className="min-w-0 w-full"
                          name={`templates.${index}.name`}
                          label={i18n._(t`Template name`)}
                        />

                        <Button
                          type="button"
                          variation="outline"
                          className="ml-3 text-primary mt-7"
                          onClick={() => remove(index)}
                          disabled={values.templates.length <= 1}
                          aria-label={i18n._(t`Remove template`)}
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

          <Button
            className="self-start mt-6"
            variation="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Trans>Creating model...</Trans>
            ) : (
              <Trans>Create model</Trans>
            )}
          </Button>

          {hasError && (
            <Alert className="mt-6 self-start" type="assertive" mode="warning">
              <p>
                {i18n._(
                  t`An error has occurred when creating your model. Submit the form to try again`
                )}
              </p>
            </Alert>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default ModelTemplatesForm
