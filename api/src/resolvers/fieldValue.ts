import { IResolvers } from 'graphql-tools'

import { FieldModel } from '../models'
import { FieldValueDocument } from '../models/Note'

export const root: IResolvers = {
  FieldValue: {
    id: (root: FieldValueDocument) => root._id.toString(),
    field: (root: FieldValueDocument) => FieldModel.findById(root.fieldId),
  },
}
