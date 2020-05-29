import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { DeckModel } from '../../mongo'
import { DeckType } from './types'

export const deleteDeck = mutationWithClientMutationId({
  name: 'DeleteDeck',
  description: 'Delete a deck',
  inputFields: {
    id: { type: GraphQLNonNull(GraphQLID), description: 'Deck id' },
  },
  outputFields: {
    deck: { type: DeckType, description: 'Deleted deck' },
  },
  mutateAndGetPayload: async ({ id }, { user }: Context) => {
    const { id: deckId } = fromGlobalId(id)

    return {
      deck: await DeckModel.findOneAndDelete({
        _id: deckId,
        ownerId: user?._id,
      }).exec(),
    }
  },
})
