import { IResolvers, IResolverObject } from 'graphql-tools'
import { Card, Note, Template } from '../../models'

export const root: IResolvers = {
  Card: {
    id: root => root._id.toString(),
    note: root => Note.findById(root.noteId),
    template: root => Template.findById(root.templateId),
  },
}

export const queries: IResolverObject = {
  card: async (_, { id }) => {
    const card = await Card.findById(id)

    return card
  },
}
