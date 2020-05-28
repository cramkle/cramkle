import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import { NoteModel, TemplateModel } from '../../mongo'
import { FlashCardDocument } from '../../mongo/Note'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { NoteType } from '../deck/types'
import { TemplateType } from '../template/types'

export const FlashCardStatusEnumType = new GraphQLEnumType({
  name: 'FlashCardStatus',
  values: {
    NEW: {},
    LEARNING: {},
    REVIEW: {},
  },
})

export const FlashCardType: GraphQLObjectType<
  FlashCardDocument,
  Context
> = new GraphQLObjectType<FlashCardDocument, Context>({
  name: 'FlashCard',
  description: `
FlashCards are what the user study/reviews in the study sessions.

The objects of this type are auto generated when creating
the note and depend of the number of templates that are
associated with the model.

The number of flashcards on each note is always equal to the
number of templates.
  `.trim(),
  fields: () => ({
    id: graphQLGlobalIdField(),
    note: {
      type: NoteType,
      description: 'Parent note of the flashcard.',
      resolve: (root) => NoteModel.findById(root.noteId),
    },
    template: {
      type: TemplateType,
      description: 'Template associated with this flashcard.',
      resolve: (root) => TemplateModel.findById(root.templateId),
    },
    status: {
      type: FlashCardStatusEnumType,
      description: 'Current status of this flashcard.',
      resolve: (root) => root.status ?? root.state,
    },
    due: {
      type: GraphQLFloat,
      description: 'Due date of this flashcard, in a timestamp format.',
      resolve: (root) => root.due?.getTime(),
    },
    active: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: `
Whether to be filtered of not.

Acts like a logical deletion it when comes to the review.
      `.trim(),
    },
    lapses: {
      type: GraphQLNonNull(GraphQLInt),
      description:
        'Number of times the user has forgotten the answer to this flashcard.',
    },
    reviews: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'Number of times the user has reviewed this flashcard.',
    },
    interval: {
      type: GraphQLNonNull(GraphQLInt),
      description:
        'Base interval number used for calculating the next due date.',
    },
    easeFactor: {
      type: GraphQLNonNull(GraphQLFloat),
      description:
        'Ease factor used for calculating the interval when the user correctly answers the flashcard.',
    },
  }),
})
