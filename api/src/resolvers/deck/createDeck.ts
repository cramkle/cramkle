import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { DeckModel } from '../../mongo'
import { DeckType } from './types'

export const createDeck = mutationWithClientMutationId({
  name: 'CreateDeck',
  description: 'Create a deck entity',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString), description: 'Deck title' },
    description: { type: GraphQLString, description: 'Deck description' },
  },
  outputFields: {
    deck: { type: DeckType, description: 'Created deck' },
  },
  mutateAndGetPayload: async ({ title, description }, { user }: Context) => {
    const deck = await DeckModel.create({
      title,
      description,
      ownerId: user?._id,
    })

    return { deck }
  },
})
