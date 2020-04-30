import { IResolvers } from 'graphql-tools'

import { NoteModel, TemplateModel } from '../mongo'
import { FlashCardDocument } from '../mongo/Note'
import { globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  FlashCard: {
    id: globalIdField(),
    note: (root: FlashCardDocument) => NoteModel.findById(root.noteId),
    template: (root: FlashCardDocument) =>
      TemplateModel.findById(root.templateId),
    status: (root: FlashCardDocument) => root.status ?? root.state,
    state: (root: FlashCardDocument) => root.status,
    due: (root: FlashCardDocument) => root.due?.getTime(),
  },
}
