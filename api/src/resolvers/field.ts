import { IResolvers } from 'graphql-tools'
import { ModelModel } from '../mongo'
import { FieldDocument } from '../mongo/Field'

export const root: IResolvers = {
  Field: {
    id: (root: FieldDocument) => root._id.toString(),
    model: (root: FieldDocument) => ModelModel.findById(root.modelId),
  },
}
