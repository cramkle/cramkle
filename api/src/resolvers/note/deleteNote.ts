import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { NoteModel } from '../../mongo'
import { NoteType } from '../deck/types'

export const deleteNote = mutationWithClientMutationId({
  name: 'DeleteNote',
  description: 'Deletes a given note',
  inputFields: {
    noteId: { type: GraphQLNonNull(GraphQLID), description: 'Note id' },
  },
  outputFields: { note: { type: NoteType } },
  mutateAndGetPayload: async (args: { noteId: string }, ctx) => {
    const { id: noteId } = fromGlobalId(args.noteId)

    const note = await NoteModel.findOne({
      _id: noteId,
      ownerId: ctx.user?._id,
    })

    if (!note) {
      throw new Error('Note not found')
    }

    await note.remove()

    return { note }
  },
})
