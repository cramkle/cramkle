import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { DeckModel } from '../../mongo'
import { DeckType } from './types'

export const updateDeck = mutationWithClientMutationId({
  name: 'UpdateDeck',
  description: 'Update a deck',
  inputFields: {
    id: { type: GraphQLNonNull(GraphQLID), description: 'Deck id' },
    title: { type: GraphQLString, description: 'New title' },
    description: { type: GraphQLString, description: 'New description' },
  },
  outputFields: {
    deck: { type: DeckType, description: 'Updated deck' },
  },
  mutateAndGetPayload: ({ id, title, description }, { user }: Context) => {
    const { id: deckId } = fromGlobalId(id)

    return {
      deck: DeckModel.findOneAndUpdate(
        { _id: deckId, ownerId: user?._id },
        { title, description },
        { new: true }
      ),
    }
  },
})
