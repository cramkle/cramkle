import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { FieldArray, Formik } from 'formik'
import gql from 'graphql-tag'
import { Location } from 'history'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router'
import * as yup from 'yup'

import { TIMEOUT_MEDIUM, pushToast } from '../../toasts/pushToast'
import BackButton from '../BackButton'
import { TextInputField } from '../forms/Fields'
import TrashBinIcon from '../icons/TrashBinIcon'
import Button from '../views/Button'
import Container from '../views/Container'
import {
  Body1,
  Body2,
  Headline1,
  Headline2,
  Headline3,
} from '../views/Typography'
import styles from './AddModelPage.css'
import { MODELS_QUERY } from './ModelsSection'
import {
  CreateModelMutation,
  CreateModelMutationVariables,
} from './__generated__/CreateModelMutation'
import { ModelsQuery } from './__generated__/ModelsQuery'

const CREATE_MODEL_MUTATION = gql`
  mutation CreateModelMutation(
    $name: String!
    $fields: [FieldInput!]!
    $templates: [TemplateInput!]!
  ) {
    createModel(
      input: { name: $name, fields: $fields, templates: $templates }
    ) {
      model {
        id
        name
        templates {
          id
          name
        }
        fields {
          id
          name
        }
      }
    }
  }
`

const AddModelPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation() as Location<{ referrer?: string }>
  const { i18n } = useLingui()

  const [mutate] = useMutation<
    CreateModelMutation,
    CreateModelMutationVariables
  >(CREATE_MODEL_MUTATION)

  return (
    <Container>
      <BackButton to={location.state?.referrer ?? '/'} />

      <Headline1 className="border-b border-divider text-primary">
        <Trans>Create model</Trans>
      </Headline1>

      <Body1 className="mt-6 text-primary">
        <Trans>
          A model consist of both fields and templates. A field is used in a
          note to fill values that are used inside the template, and the
          template is used to define the frontside and backside of each
          flashcard, using the fields defined in the model. You'll be able to
          edit the templates content after creating the model.
        </Trans>
      </Body1>

      <Body1 className="mt-3 text-primary">
        <Trans>
          When you create a note, we will create the corresponding number of
          flashcards based on how much templates the note's model has, and will
          use the note's values to fill in the template.
        </Trans>
      </Body1>

      <Formik
        initialValues={{ name: '', fields: [], templates: [] }}
        validateOnBlur
        validationSchema={yup.object().shape({
          name: yup.string().required(i18n._(t`Name is required`)),
          fields: yup.array(
            yup.object().shape({
              name: yup.string().required(i18n._(t`Field name is required`)),
            })
          ),
          templates: yup.array(
            yup.object().shape({
              name: yup.string().required(i18n._(t`Template name is required`)),
            })
          ),
        })}
        onSubmit={(values) => {
          return mutate({
            variables: values,
            update: (proxy, mutationResult) => {
              const data = proxy.readQuery<ModelsQuery>({
                query: MODELS_QUERY,
              })

              const { createModel } = mutationResult!.data!

              data?.models.push(createModel!.model!)

              proxy.writeQuery({ query: MODELS_QUERY, data })
            },
          }).then((query) => {
            pushToast(
              {
                message: t`Model created successfully`,
                action: {
                  label: t`View`,
                  onPress: () => {
                    navigate(`/m/${query.data!.createModel!.model!.id}`)
                  },
                },
              },
              TIMEOUT_MEDIUM
            )

            navigate(location.state?.referrer ?? '/models')
          })
        }}
      >
        {({ handleSubmit, values, isSubmitting }) => (
          <form
            className="flex flex-col w-full mt-8 mb-4"
            onSubmit={handleSubmit}
          >
            <TextInputField name="name" label={i18n._(t`Model name`)} />

            <div className="flex flex-col sm:flex-row">
              <FieldArray name="templates" validateOnChange={false}>
                {({ push, remove }) => (
                  <div className={`${styles.evenColumn} mt-4 sm:pr-4`}>
                    <Headline2 className="text-primary">
                      <Trans>Templates</Trans>
                    </Headline2>
                    <div className="my-6 flex flex-col">
                      {values.templates?.length ? (
                        values.templates.map((_, index) => (
                          <>
                            <Headline3 className="text-primary">
                              <Trans>Template #{index}</Trans>
                            </Headline3>

                            <div className="my-3 flex" key={index}>
                              <div className="w-full">
                                <TextInputField
                                  className="w-full"
                                  name={`templates.${index}.name`}
                                  label={i18n._(t`Template name`)}
                                />
                              </div>

                              <Button
                                variation="outline"
                                className="ml-3 text-primary"
                                onClick={() => remove(index)}
                                aria-label={i18n._(t`Remove template`)}
                                style={{
                                  marginTop: 'calc(1.5rem + 0.0625rem)',
                                }}
                              >
                                <TrashBinIcon />
                              </Button>
                            </div>
                          </>
                        ))
                      ) : (
                        <Body2 className="mx-auto mb-3">
                          <Trans>No templates added</Trans>
                        </Body2>
                      )}

                      <Button
                        className="self-start"
                        onClick={() => push({ name: '' })}
                      >
                        <Trans>Add template</Trans>
                      </Button>
                    </div>
                  </div>
                )}
              </FieldArray>

              <FieldArray name="fields" validateOnChange={false}>
                {({ push, remove }) => (
                  <div className={`${styles.evenColumn} mt-4`}>
                    <Headline2 className="text-primary">
                      <Trans>Fields</Trans>
                    </Headline2>
                    <div className="my-6 flex flex-col">
                      {values.fields?.length ? (
                        values.fields.map((_, index) => (
                          <>
                            <Headline3 className="text-primary">
                              <Trans>Field #{index}</Trans>
                            </Headline3>

                            <div className="my-3 flex" key={index}>
                              <div className="w-full">
                                <TextInputField
                                  className="w-full"
                                  name={`fields.${index}.name`}
                                  label={i18n._(t`Field name`)}
                                />
                              </div>

                              <Button
                                variation="outline"
                                className="ml-3 text-primary"
                                onClick={() => remove(index)}
                                aria-label={i18n._(t`Remove field`)}
                                style={{
                                  marginTop: 'calc(1.5rem + 0.0625rem)',
                                }}
                              >
                                <TrashBinIcon />
                              </Button>
                            </div>
                          </>
                        ))
                      ) : (
                        <Body2 className="mx-auto mb-3">
                          <Trans>No fields added</Trans>
                        </Body2>
                      )}

                      <Button
                        className="self-start"
                        onClick={() => push({ name: '' })}
                      >
                        <Trans>Add field</Trans>
                      </Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>

            <Button
              className="self-start mt-4"
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
          </form>
        )}
      </Formik>
    </Container>
  )
}

export default AddModelPage
