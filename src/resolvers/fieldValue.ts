import { IResolvers } from 'graphql-tools'

import { Field } from '../models'

export const root: IResolvers = {
  FieldValue: {
    id: root => root._id.toString(),
    field: root => Field.findById(root.fieldId),
  },
}
