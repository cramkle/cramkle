const { Card, Note, Template } = require('../../models')

module.exports = {
  root: {
    Card: {
      id: root => root._id.toString(),
      note: root => Note.findById(root.noteId),
      template: root => Template.findById(root.templateId),
    },
  },
  queries: {
    card: async (_, { id }) => {
      const card = await Card.findById(id)

      return card
    },
  },
}
