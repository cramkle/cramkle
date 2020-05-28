import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql'

import { ModelModel } from '../../mongo'
import { ModelType } from './types'

export const models: GraphQLFieldConfig<void, Context> = {
  type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ModelType))),
  description: 'Retrieve all models for the logged user',
  resolve: async (_, __, { user }) => {
    return ModelModel.find({ ownerId: user!._id })
  },
}
