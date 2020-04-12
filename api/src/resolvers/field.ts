import { IResolvers } from 'graphql-tools'
import { ModelModel } from '../models'

export const root: IResolvers = {
  Field: {
    id: (root) => root._id.toString(),
    model: (root) => ModelModel.findById(root.modelId),
  },
}
