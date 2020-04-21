import { IResolvers } from 'graphql-tools'

import { NoteModel, TemplateModel } from '../mongo'
import { FlashCardDocument } from '../mongo/Note'

export const root: IResolvers = {
  FlashCard: {
    id: (root: FlashCardDocument) => root._id.toString(),
    note: (root: FlashCardDocument) => NoteModel.findById(root.noteId),
    template: (root: FlashCardDocument) =>
      TemplateModel.findById(root.templateId),
  },
}
