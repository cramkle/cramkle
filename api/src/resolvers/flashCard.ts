import { IResolvers } from 'graphql-tools'
import { NoteModel, TemplateModel } from '../models'

export const root: IResolvers = {
  Card: {
    id: (root) => root._id.toString(),
    note: (root) => NoteModel.findById(root.noteId),
    template: (root) => TemplateModel.findById(root.templateId),
  },
}
