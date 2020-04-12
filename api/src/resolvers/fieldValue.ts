import { IResolvers } from 'graphql-tools'

import { FieldModel } from '../models'

export const root: IResolvers = {
  FieldValue: {
    id: (root) => root._id.toString(),
    field: (root) => FieldModel.findById(root.fieldId),
  },
}
