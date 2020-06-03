import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { FieldArray, Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import * as yup from 'yup'

import { notificationState } from '../../notification/index'
import BackButton from '../BackButton'
import { MODELS_QUERY } from '../ModelList'
import { ModelsQuery } from '../__generated__/ModelsQuery'
import { TextInputField } from '../forms/Fields'
import TrashBinIcon from '../icons/TrashBinIcon'
import Button from '../views/Button'
import Container from '../views/Container'
import IconButton from '../views/IconButton'
import { Body1, Body2, Headline1 } from '../views/Typography'
import styles from './AddModelPage.css'
import {
  CreateModelMutation,
  CreateModelMutationVariables,
} from './__generated__/CreateModelMutation'

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
  const history = useHistory()
  const { i18n } = useLingui()

  const [mutate] = useMutation<
    CreateModelMutation,
    CreateModelMutationVariables
  >(CREATE_MODEL_MUTATION)

  return (
    <Container>
      <BackButton />

      <Headline1>
        <Trans>Create Model</Trans>
      </Headline1>

      <Formik
        initialValues={{ name: '', fields: [], templates: [] }}
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
            update: (proxy, { data: { createModel } }) => {
              const data = proxy.readQuery<ModelsQuery>({
                query: MODELS_QUERY,
              })

              data.models.push(createModel.model)

              proxy.writeQuery({ query: MODELS_QUERY, data })
            },
          }).then((query) => {
            // make typescript happy
            if (!query) {
              return
            }

            notificationState.addNotification({
              message: t`Model created successfully`,
              actionText: t`View`,
              onAction: () => {
                history.push(`/m/${query.data.createModel.model.id}`)
              },
            })

            history.push('/models')
          })
        }}
      >
        {({ handleSubmit, values, isValid, isSubmitting }) => (
          <form className="flex flex-col w-full py-4" onSubmit={handleSubmit}>
            <TextInputField name="name" label={i18n._(t`Name`)} />

            <div className="flex flex-col sm:flex-row">
              <FieldArray name="templates" validateOnChange={false}>
                {({ push, remove }) => (
                  <div className={`${styles.evenColumn} mt-4 sm:pr-4`}>
                    <Body1>
                      <Trans>Templates</Trans>
                    </Body1>
                    <div className="py-2">
                      {values.templates && values.templates.length ? (
                        values.templates.map((_, index) => (
                          <div className="mb-2 flex items-center" key={index}>
                            <div className="w-full">
                              <TextInputField
                                className="w-full"
                                name={`templates.${index}.name`}
                                label={i18n._(t`Template name`)}
                              />
                            </div>

                            <IconButton
                              className="ml-1 text-primary"
                              onClick={() => remove(index)}
                              aria-label={i18n._(t`Remove template`)}
                            >
                              <TrashBinIcon />
                            </IconButton>
                          </div>
                        ))
                      ) : (
                        <Body2>
                          <Trans>No templates added</Trans>
                        </Body2>
                      )}
                    </div>

                    <Button onClick={() => push({ name: '' })}>
                      <Trans>Add template</Trans>
                    </Button>
                  </div>
                )}
              </FieldArray>

              <FieldArray name="fields" validateOnChange={false}>
                {({ push, remove }) => (
                  <div className={`${styles.evenColumn} mt-4`}>
                    <Body1>
                      <Trans>Fields</Trans>
                    </Body1>
                    <div className="py-2">
                      {values.fields && values.fields.length ? (
                        values.fields.map((_, index) => (
                          <div className="mb-2 flex items-center" key={index}>
                            <div className="w-full">
                              <TextInputField
                                className="w-full"
                                name={`fields.${index}.name`}
                                label={i18n._(t`Field name`)}
                              />
                            </div>

                            <IconButton
                              className="ml-1 text-primary"
                              onClick={() => remove(index)}
                              aria-label={i18n._(t`Remove field`)}
                            >
                              <TrashBinIcon />
                            </IconButton>
                          </div>
                        ))
                      ) : (
                        <Body2>
                          <Trans>No fields added</Trans>
                        </Body2>
                      )}
                    </div>

                    <Button onClick={() => push({ name: '' })}>
                      <Trans>Add field</Trans>
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            <Button
              className="self-start mt-4"
              variation="primary"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              <Trans>Create</Trans>
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  )
}

export default AddModelPage
