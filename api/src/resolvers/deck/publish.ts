import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { DeckModel } from '../../mongo'
import { DeckType } from './types'

export const publishDeck = mutationWithClientMutationId({
  name: 'PublishDeck',
  description: 'Publish a deck to the marketplace',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'Id of the deck to publish',
    },
  },
  outputFields: { deck: { type: DeckType } },
  mutateAndGetPayload: ({ id }, { user }: Context) => {
    const { id: deckId } = fromGlobalId(id)

    return {
      deck: DeckModel.findOneAndUpdate(
        { _id: deckId, ownerId: user?._id },
        { published: true },
        { new: true }
      ),
    }
  },
})

export const unpublishDeck = mutationWithClientMutationId({
  name: 'UnpublishDeck',
  description: 'Unpublish a deck from the marketplace',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'Id of the deck to remove from marketplace',
    },
  },
  outputFields: { deck: { type: DeckType } },
  mutateAndGetPayload: ({ id }, { user }: Context) => {
    const { id: deckId } = fromGlobalId(id)

    return {
      deck: DeckModel.findOneAndUpdate(
        { _id: deckId, ownerId: user?._id },
        { published: false },
        {
          new: true,
        }
      ),
    }
  },
})
