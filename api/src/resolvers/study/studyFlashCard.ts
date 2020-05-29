import { GraphQLFieldConfig, GraphQLString } from 'graphql'

import { DeckModel } from '../../mongo'
import { studyFlashCardsByDeck } from '../../utils/study'
import { FlashCardType } from '../flashCard/types'

export const studyFlashCard: GraphQLFieldConfig<
  void,
  Context,
  { deckSlug: string }
> = {
  type: FlashCardType,
  description:
    'Retrieves the next flashcard for a study session in the given deck',
  args: {
    deckSlug: { type: GraphQLString },
  },
  resolve: async (_, { deckSlug }, ctx) => {
    const deck = await DeckModel.findOne({
      slug: deckSlug,
      ownerId: ctx.user!._id,
    })

    if (!deck) {
      throw new Error('Deck not found')
    }

    const flashCards = await studyFlashCardsByDeck(deck._id)

    return flashCards[0]
  },
}
