import { GraphQLEnumType } from 'graphql'

export const FlashCardAnswerEnumType = new GraphQLEnumType({
  name: 'FlashCardAnswer',
  values: {
    REPEAT: {},
    HARD: {},
    GOOD: {},
    EASY: {},
  },
})
