const { Field, CardModel } = require('../../models')

module.exports = {
  root: {
    Field: {
      id: root => root._id.toString(),
      model: root => CardModel.findById(root.modelId),
    },
  },
  queries: {
    field: async (_, { id }) => {
      const field = await Field.findById(id)

      return field
    },
  },
}
