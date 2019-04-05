import { IResolvers, IResolverObject } from 'graphql-tools'

import { findRefFromList } from '../utils'
import { FieldValue, Field, Block } from '../../models'

export const root: IResolvers = {
  FieldValue: {
    id: root => root._id.toString(),
    field: root => Field.findById(root.fieldId),
    data: root => Promise.all(findRefFromList(Block, root.data)),
  },
}

export const queries: IResolverObject = {
  fieldValue: async (_, { id }) => {
    const fieldValue = await FieldValue.findById(id)

    return fieldValue
  },
}
