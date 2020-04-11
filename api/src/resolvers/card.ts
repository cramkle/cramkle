import { IResolvers } from 'graphql-tools'
import { Note, Template } from '../models'

export const root: IResolvers = {
  Card: {
    id: (root) => root._id.toString(),
    note: (root) => Note.findById(root.noteId),
    template: (root) => Template.findById(root.templateId),
  },
}
