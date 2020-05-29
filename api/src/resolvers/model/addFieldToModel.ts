import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { FieldModel } from '../../mongo'
import { FieldType } from '../field/types'

interface AddFieldInput {
  modelId: string
  name: string
}

export const addFieldToModel: GraphQLFieldConfig<
  void,
  Context,
  AddFieldInput
> = mutationWithClientMutationId({
  name: 'AddFieldToModel',
  description: 'Adds a new fields to a model',
  inputFields: {
    modelId: { type: GraphQLNonNull(GraphQLID), description: 'Model id' },
    name: { type: GraphQLNonNull(GraphQLString), description: 'Field name' },
  },
  outputFields: {
    field: { type: FieldType },
  },
  mutateAndGetPayload: async (args: AddFieldInput, { user }: Context) => {
    const { id: modelId } = fromGlobalId(args.modelId)

    const field = await FieldModel.create({
      name: args.name,
      modelId,
      ownerId: user?._id,
    })

    return { field }
  },
})
