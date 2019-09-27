import { IResolvers } from 'graphql-tools'
import { CardModel } from '../models'

export const root: IResolvers = {
  Field: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
  },
}
