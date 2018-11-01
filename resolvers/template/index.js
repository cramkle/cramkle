const { Template, CardModel } = require('../../models')

module.exports = {
  root: {
    Template: {
      id: root => root._id.toString(),
      model: root => CardModel.findById(root.modelId),
    },
  },
  queries: {
    template: async (_, { id }) => {
      const template = await Template.findById(id)

      return template
    },
  },
}
