import { Card, Note, Template } from '../../models'

export const root = {
  Card: {
    id: root => root._id.toString(),
    note: root => Note.findById(root.noteId),
    template: root => Template.findById(root.templateId),
  },
}

export const queries = {
  card: async (_, { id }) => {
    const card = await Card.findById(id)

    return card
  },
}
