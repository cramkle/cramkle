import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId } from 'graphql-relay'

import { DeckModel, NoteModel } from '../../mongo'
import { NoteType } from '../deck/types'

export const note: GraphQLFieldConfig<void, Context, { id: string }> = {
  type: NoteType,
  description: "Get single note by it's id",
  args: { id: { type: GraphQLNonNull(GraphQLID) } },
  resolve: async (_, args, { user }) => {
    const { id: noteId } = fromGlobalId(args.id)
    const userDecks = await DeckModel.find({ ownerId: user?._id })

    const note = await NoteModel.findOne({
      _id: noteId,
      deckId: {
        $in: userDecks.map(({ _id }) => _id),
      },
    })

    if (!note) {
      throw new Error('Note not found')
    }

    return note
  },
}
