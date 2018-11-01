const { FieldValue, Field } = require('../../models')

module.exports = {
  root: {
    FieldValue: {
      id: root => root._id.toString(),
      field: root => Field.findById(root.fieldId),
    },
  },
  queries: {
    fieldValue: async (_, { id }) => {
      const fieldValue = await FieldValue.findById(id)

      return fieldValue
    },
  },
}
