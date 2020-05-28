import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'

import { DeckModel } from '../../mongo'
import { studyFlashCardsByDeck } from '../../utils/study'
import { DeckType } from './types'

interface DecksArgs {
  studyOnly: boolean
}

export const decks: GraphQLFieldConfig<void, Context, DecksArgs> = {
  type: GraphQLNonNull(GraphQLList(GraphQLNonNull(DeckType))),
  description: 'Retrieve all decks for the logged user',
  args: {
    studyOnly: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not to filter only for decks pending to study',
      defaultValue: false,
    },
  },
  resolve: async (_, { studyOnly }, { user }) => {
    let decks = await DeckModel.find({ ownerId: user?._id })

    if (studyOnly) {
      // eslint-disable-next-line require-atomic-updates
      decks = await Promise.all(
        decks.map((deck) =>
          studyFlashCardsByDeck(deck._id).then(
            (flashCards) => flashCards.length > 0
          )
        )
      ).then((results) => decks.filter((_, index) => results[index]))
    }

    return decks
  },
}
