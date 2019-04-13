import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'
import { Headline5, Body1, Body2 } from '@material/react-typography'
import { Formik, FieldArray } from 'formik'
import React from 'react'
import { graphql, compose, ChildMutateProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import * as yup from 'yup'

import BackButton from '../BackButton'
import { TextInputField } from '../forms/Fields'
import createModelMutation from '../../graphql/createModelMutation.gql'
import modelsQuery from '../../graphql/modelsQuery.gql'

interface Model {
  id: string
  name: string
  templates: {
    id: string
    name: string
  }[]
}

interface MutationData {
  createModel: Model
}

interface QueryData {
  cardModels: Model[]
}

const AddModelPage: React.FunctionComponent<
  ChildMutateProps<RouteComponentProps, MutationData>
> = ({ history, mutate }) => {
  return (
    <div className="pa3 ph4-m ph6-l">
      <BackButton />

      <Headline5>Create Model</Headline5>

      <Formik
        initialValues={{ name: '', fields: [] }}
        validationSchema={yup.object().shape({
          name: yup.string().required('Name is required'),
          fields: yup.array(
            yup.object().shape({
              name: yup.string().required('Field name is required'),
            })
          ),
        })}
        onSubmit={values => {
          return mutate({
            variables: values,
            update: (proxy, { data: { createModel } }) => {
              const data = proxy.readQuery<QueryData>({ query: modelsQuery })

              data.cardModels.push(createModel)

              proxy.writeQuery({ query: modelsQuery, data })
            },
          }).then(query => {
            // make typescript happy
            if (!query) {
              return
            }

            history.push('/models', { newModel: query.data.createModel.id })
          })
        }}
      >
        {({ handleSubmit, values, isValid, isSubmitting }) => (
          <form className="flex flex-column w-100 pv3" onSubmit={handleSubmit}>
            <TextInputField name="name" label="Name" />

            <FieldArray name="fields" validateOnChange={false}>
              {({ push, remove }) => (
                <div className="mt3">
                  <Body1>Fields</Body1>
                  <div className="pv2">
                    {values.fields && values.fields.length ? (
                      values.fields.map((_, index) => (
                        <div className="mb2 flex items-baseline" key={index}>
                          <div className="w-100">
                            <TextInputField
                              className="w-100"
                              name={`fields.${index}.name`}
                              label="Field name"
                            />
                          </div>

                          <Button
                            className="ml3"
                            outlined
                            icon={<MaterialIcon icon="delete" />}
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <Body2>No fields added</Body2>
                    )}
                  </div>

                  <Button onClick={() => push({ name: '' })}>Add field</Button>
                </div>
              )}
            </FieldArray>

            <Button
              className="self-start mt3"
              type="submit"
              raised
              disabled={!isValid || isSubmitting}
            >
              Create
            </Button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default compose(
  graphql<{}, MutationData>(createModelMutation),
  withRouter
)(AddModelPage)
