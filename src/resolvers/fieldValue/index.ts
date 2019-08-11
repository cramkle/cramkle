import { IResolvers, IResolverObject } from 'graphql-tools'

import { FieldValue, Field, ContentState } from '../../models'

export const root: IResolvers = {
  FieldValue: {
    id: root => root._id.toString(),
    field: root => Field.findById(root.fieldId),
    data: root => ContentState.findById(root.dataId),
  },
}

export const queries: IResolverObject = {
  fieldValue: async (_, { id }) => {
    const fieldValue = await FieldValue.findById(id)

    return fieldValue
  },
}
