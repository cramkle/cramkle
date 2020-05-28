import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { NoteModel } from '../../mongo'
import { ContentStateInputType } from '../contentState/types'
import { FieldValueType } from './types'

interface UpdateFieldValueArgs {
  noteId: string
  fieldId: string
  data: ContentStateInput
}

export const updateFieldValue = mutationWithClientMutationId({
  name: 'UpdateFieldValue',
  description: 'Updates the field value of a note',
  inputFields: {
    noteId: { type: GraphQLNonNull(GraphQLID), description: 'Note id' },
    fieldId: { type: GraphQLNonNull(GraphQLID), description: 'Field id' },
    data: {
      type: GraphQLNonNull(ContentStateInputType),
      description: 'Field value content',
    },
  },
  outputFields: {
    fieldValue: { type: FieldValueType },
  },
  mutateAndGetPayload: async (args: UpdateFieldValueArgs) => {
    const { data } = args
    const { id: noteId } = fromGlobalId(args.noteId)
    const { id: fieldId } = fromGlobalId(args.fieldId)

    const note = await NoteModel.findById(noteId)
    const fieldValue = note?.values.find(
      (fieldValue) => fieldId === fieldValue.fieldId.toString()
    )

    if (!fieldValue) {
      throw new Error('Note or field value not found')
    }

    fieldValue.set('data', data)

    await NoteModel.updateOne(
      { _id: noteId, 'values._id': fieldValue._id },
      { $set: { 'values.$': fieldValue } }
    )

    return { fieldValue }
  },
})
