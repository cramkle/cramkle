import { IResolvers } from 'graphql-tools'
import { NoteModel, TemplateModel } from '../models'
import { FlashCardDocument } from '../models/Note'

export const root: IResolvers = {
  Card: {
    id: (root: FlashCardDocument) => root._id.toString(),
    note: (root: FlashCardDocument) => NoteModel.findById(root.noteId),
    template: (root: FlashCardDocument) =>
      TemplateModel.findById(root.templateId),
  },
}
