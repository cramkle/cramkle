import { IResolvers, IResolverObject } from 'graphql-tools'
import { Note, Template } from '../../models'

export const root: IResolvers = {
  Card: {
    id: root => root._id.toString(),
    note: root => Note.findById(root.noteId),
    template: root => Template.findById(root.templateId),
  },
}

export const queries: IResolverObject = {
  card: async (_, { noteId, id }) => {
    const note = await Note.findById(noteId)
    const card = note.cards.id(id)

    return card
  },
}
