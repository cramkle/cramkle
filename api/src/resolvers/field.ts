import { IResolvers } from 'graphql-tools'

import { ModelModel } from '../mongo'
import { FieldDocument } from '../mongo/Field'
import { globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  Field: {
    id: globalIdField(),
    model: (root: FieldDocument) => ModelModel.findById(root.modelId),
  },
}
