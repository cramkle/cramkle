import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { TemplateModel } from '../../mongo'
import { TemplateType } from '../template/types'

interface AddTemplateInput {
  modelId: string
  name: string
}

export const addTemplateToModel: GraphQLFieldConfig<
  void,
  Context,
  AddTemplateInput
> = mutationWithClientMutationId({
  name: 'AddTemplateToModel',
  description: 'Adds a new template to a model',
  inputFields: {
    modelId: { type: GraphQLNonNull(GraphQLID), description: 'Model id' },
    name: { type: GraphQLNonNull(GraphQLString), description: 'Template name' },
  },
  outputFields: {
    template: { type: TemplateType },
  },
  mutateAndGetPayload: async (args: AddTemplateInput, { user }: Context) => {
    const { id: modelId } = fromGlobalId(args.modelId)

    const template = await TemplateModel.create({
      name: args.name,
      modelId,
      ownerId: user?._id,
    })

    return { template }
  },
})
