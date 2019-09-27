import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Body1, Body2, Headline5 } from 'views/Typography'
import { FieldArray, Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'
import * as yup from 'yup'

import {
  CreateModelMutation,
  CreateModelMutationVariables,
} from './__generated__/CreateModelMutation'
import BackButton from 'components/BackButton'
import { TextInputField } from 'forms/Fields'
import Container from 'views/Container'
import Button from 'views/Button'
import Icon from 'views/Icon'
import IconButton from 'views/IconButton'
import { notificationState } from 'notification/index'
import { MODELS_QUERY } from '../ModelList'
import { ModelsQuery } from '../__generated__/ModelsQuery'

import styles from './AddModelPage.css'

const CREATE_MODEL_MUTATION = gql`
  mutation CreateModelMutation(
    $name: String!
    $fields: [FieldInput]
    $templates: [TemplateInput]
  ) {
    createModel(name: $name, fields: $fields, templates: $templates) {
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

      <Headline5>
        <Trans>Create Model</Trans>
      </Headline5>

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
        onSubmit={values => {
          return mutate({
            variables: values,
            update: (proxy, { data: { createModel } }) => {
              const data = proxy.readQuery<ModelsQuery>({
                query: MODELS_QUERY,
              })

              data.cardModels.push(createModel)

              proxy.writeQuery({ query: MODELS_QUERY, data })
            },
          }).then(query => {
            // make typescript happy
            if (!query) {
              return
            }

            notificationState.addNotification({
              message: t`Model created successfully`,
              actionText: t`View`,
              onAction: () => {
                history.push(`/m/${query.data.createModel.id}`)
              },
            })

            history.push('/models')
          })
        }}
      >
        {({ handleSubmit, values, isValid, isSubmitting }) => (
          <form className="flex flex-column w-100 pv3" onSubmit={handleSubmit}>
            <TextInputField name="name" label={i18n._(t`Name`)} />

            <div className="flex flex-column flex-row-ns">
              <FieldArray name="templates" validateOnChange={false}>
                {({ push, remove }) => (
                  <div className={`${styles.evenColumn} mt3 pr3-ns`}>
                    <Body1>
                      <Trans>Templates</Trans>
                    </Body1>
                    <div className="pv2">
                      {values.templates && values.templates.length ? (
                        values.templates.map((_, index) => (
                          <div className="mb2 flex items-baseline" key={index}>
                            <div className="w-100">
                              <TextInputField
                                className="w-100"
                                name={`templates.${index}.name`}
                                label={i18n._(t`Template name`)}
                              />
                            </div>

                            <IconButton
                              className="ml1 c-primary"
                              onClick={() => remove(index)}
                              aria-label={i18n._(t`Remove template`)}
                            >
                              <Icon icon="delete" aria-hidden="true" />
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
                  <div className={`${styles.evenColumn} mt3`}>
                    <Body1>
                      <Trans>Fields</Trans>
                    </Body1>
                    <div className="pv2">
                      {values.fields && values.fields.length ? (
                        values.fields.map((_, index) => (
                          <div className="mb2 flex items-baseline" key={index}>
                            <div className="w-100">
                              <TextInputField
                                className="w-100"
                                name={`fields.${index}.name`}
                                label={i18n._(t`Field name`)}
                              />
                            </div>

                            <IconButton
                              className="ml1 c-primary"
                              onClick={() => remove(index)}
                              aria-label={i18n._(t`Remove field`)}
                            >
                              <Icon icon="delete" aria-hidden="true" />
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
              className="self-start mt3"
              type="submit"
              raised
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
