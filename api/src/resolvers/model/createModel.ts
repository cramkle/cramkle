import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { FieldModel, ModelModel, TemplateModel } from '../../mongo'
import { Field } from '../../mongo/Field'
import { Template } from '../../mongo/Template'
import { FieldInputType } from '../field/types'
import { TemplateInputType } from '../template/types'
import { ModelType } from './types'

interface CreateModelInput {
  name: string
  fields: Field[]
  templates: Template[]
}

export const createModel: GraphQLFieldConfig<
  void,
  Context,
  CreateModelInput
> = mutationWithClientMutationId({
  name: 'CreateModel',
  description: 'Create a new model',
  inputFields: {
    name: { type: GraphQLNonNull(GraphQLString), description: 'Model name' },
    fields: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FieldInputType))),
      description: 'Fields',
    },
    templates: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TemplateInputType))),
      description: 'Templates',
    },
  },
  outputFields: {
    model: { type: ModelType, description: 'Created model' },
  },
  mutateAndGetPayload: async (
    { name, fields, templates }: CreateModelInput,
    { user }: Context
  ) => {
    const model = await ModelModel.create({
      name,
      ownerId: user?._id,
    })

    await Promise.all(
      fields.map((field) => FieldModel.create({ ...field, modelId: model._id }))
    )

    await Promise.all(
      templates.map((template) =>
        TemplateModel.create({
          ...template,
          modelId: model._id,
          ownerId: user?._id,
        })
      )
    )

    return { model }
  },
})
