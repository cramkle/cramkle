import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { ModelModel } from '../../mongo'
import { ModelType } from './types'

interface UpdateModelInput {
  id: string
  name: string
}

export const updateModel: GraphQLFieldConfig<
  void,
  Context,
  UpdateModelInput
> = mutationWithClientMutationId({
  name: 'UpdateModel',
  description: 'Update a model name',
  inputFields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
  },
  outputFields: { model: { type: ModelType } },
  mutateAndGetPayload: ({ id, name }: UpdateModelInput, { user }: Context) => {
    const { id: modelId } = fromGlobalId(id)

    return {
      model: ModelModel.findOneAndUpdate(
        { _id: modelId, ownerId: user?._id },
        { name },
        { new: true }
      ),
    }
  },
})
