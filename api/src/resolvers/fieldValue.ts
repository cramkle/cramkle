import { IResolverObject, IResolvers } from 'graphql-tools'

import { FieldModel, NoteModel } from '../mongo'
import { FieldValueDocument } from '../mongo/Note'
import { ApolloError } from 'apollo-server'

export const root: IResolvers = {
  FieldValue: {
    id: (root: FieldValueDocument) => root._id.toString(),
    field: (root: FieldValueDocument) => FieldModel.findById(root.fieldId),
  },
}

interface UpdateFieldValueArgs {
  noteId: string
  fieldId: string
  data: ContentStateInput
}

export const mutations: IResolverObject = {
  updateFieldValue: async (
    _: unknown,
    { noteId, fieldId, data }: UpdateFieldValueArgs
  ) => {
    const note = await NoteModel.findById(noteId)
    const fieldValue = note?.values.find(
      (fieldValue) => fieldId === fieldValue.fieldId.toString()
    )

    if (!fieldValue) {
      throw new ApolloError('Note or field value not found')
    }

    fieldValue.set('data', data)

    await NoteModel.updateOne(
      { _id: noteId, 'values._id': fieldValue._id },
      { $set: { 'values.$': fieldValue } }
    )

    return fieldValue
  },
}
