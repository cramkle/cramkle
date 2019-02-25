import { FieldValue, Field } from '../../models'

export const root = {
  FieldValue: {
    id: root => root._id.toString(),
    field: root => Field.findById(root.fieldId),
  },
}

export const queries = {
  fieldValue: async (_, { id }) => {
    const fieldValue = await FieldValue.findById(id)

    return fieldValue
  },
}
