const { CardModel, User, Template, Field } = require('../../models')

module.exports = {
  root: {
    CardModel: {
      id: root => root._id.toString(),
      owner: root => User.findById(root.ownerId),
      templates: root => Promise.all(root.templates.map(Template.findById)),
      fields: root => Promise.all(root.fields.map(Field.findById)),
    },
  },
  queries: {
    cardModel: async (_, { id }) => {
      const cardModel = await CardModel.findById(id)

      return cardModel
    },
  },
}
