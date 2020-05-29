import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { connectionFromArray } from 'graphql-relay'

import { DeckModel, ModelModel, NoteModel, UserModel } from '../../mongo'
import { DeckDocument } from '../../mongo/Deck'
import { FlashCardStatus, NoteDocument } from '../../mongo/Note'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { getNoteIdentifier } from '../../utils/noteIdentifier'
import {
  PageConnectionArgs,
  connectionWithCursorInfo,
  createPageCursors,
  pageToCursor,
} from '../../utils/pagination'
import { studyFlashCardsByDeck } from '../../utils/study'
import { FieldValueType } from '../fieldValue/types'
import { FlashCardType } from '../flashCard/types'
import { ModelType } from '../model/types'
import { nodeInterface } from '../node/types'
import { UserType } from '../user/types'

export const NoteType: GraphQLObjectType<
  NoteDocument,
  Context
> = new GraphQLObjectType<NoteDocument, Context>({
  name: 'Note',
  description: `
A note is what the user registers on each deck.

This type auto generates a number of cards, based
on the number of templates.
  `.trim(),
  interfaces: [nodeInterface],
  fields: () => ({
    id: graphQLGlobalIdField(),
    deck: {
      type: DeckType,
      description: 'Deck containing this note',
      resolve: (root) => DeckModel.findById(root.deckId),
    },
    model: {
      type: ModelType,
      description: 'Model of this note',
      resolve: (root) => ModelModel.findById(root.modelId),
    },
    values: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FieldValueType))),
      description: 'Values of this note',
    },
    flashCards: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FlashCardType))),
      description: 'Generated flashcards',
    },
    text: {
      type: GraphQLString,
      description: 'Note text representation',
      resolve: (root) => getNoteIdentifier(root),
    },
  }),
})

type StudySessionDetailsObject = { [status in FlashCardStatus]: number }

export const StudySessionDetailsType = new GraphQLObjectType({
  name: 'StudySessionDetails',
  fields: {
    newCount: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (root: StudySessionDetailsObject) => root.NEW,
    },
    learningCount: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (root: StudySessionDetailsObject) => root.LEARNING,
    },
    reviewCount: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (root: StudySessionDetailsObject) => root.REVIEW,
    },
  },
})

const deckNoteConnection = connectionWithCursorInfo({
  nodeType: NoteType,
  connectionFields: {
    totalCount: { type: GraphQLNonNull(GraphQLInt) },
  },
})

export const DeckType = new GraphQLObjectType<DeckDocument, Context>({
  name: 'Deck',
  description: 'Collection of notes',
  interfaces: [nodeInterface],
  fields: () => ({
    id: graphQLGlobalIdField(),
    title: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Title of the deck',
    },
    description: {
      type: GraphQLString,
      description: 'Description of the deck',
    },
    slug: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Unique identifiable slug',
    },
    owner: {
      type: UserType,
      description: 'Owner of the deck',
      resolve: (root) => UserModel.findById(root.ownerId),
    },
    published: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: 'Whether this deck is published to the marketplace',
    },
    studySessionDetails: {
      type: GraphQLNonNull(StudySessionDetailsType),
      description: 'Details of current study session',
      resolve: async (root) => {
        const studyFlashCards = await studyFlashCardsByDeck(root._id)

        return studyFlashCards.reduce<StudySessionDetailsObject>(
          (detailsObject, flashCard) => ({
            ...detailsObject,
            [flashCard.status]: detailsObject[flashCard.status] + 1,
          }),
          {
            NEW: 0,
            LEARNING: 0,
            REVIEW: 0,
          }
        )
      },
    },
    notes: {
      type: deckNoteConnection.connectionType,
      description: 'Notes contained in this deck',
      args: {
        page: { type: GraphQLNonNull(GraphQLInt), defaultValue: 1 },
        size: { type: GraphQLNonNull(GraphQLInt), defaultValue: 10 },
        search: { type: GraphQLString },
      },
      resolve: (async (
        root: DeckDocument,
        args: PageConnectionArgs & { search?: string }
      ) => {
        const notesQuery = NoteModel.find({ deckId: root._id })

        if (args.search) {
          notesQuery
            .find({ $text: { $search: args.search } })
            .select({ score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
        }

        const notes = await notesQuery.exec()

        const totalCount = notes.length

        const cursor = pageToCursor(args.page, args.size)
        const connection = connectionFromArray(notes, {
          after: cursor,
          first: args.size,
        })

        return Object.assign(
          {},
          {
            totalCount,
            pageCursors: createPageCursors(
              { page: args.page, size: args.size },
              totalCount
            ),
          },
          connection
        )
      }) as any,
    },
    totalNotes: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'Number of notes in this deck',
      resolve: (root) => NoteModel.find({ deckId: root._id }).count(),
    },
    totalFlashcards: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'Number of flashCards in this deck',
      resolve: (root) =>
        NoteModel.find({ deckId: root._id })
          .exec()
          .then((notes) =>
            notes.reduce((total, note) => total + note.flashCards.length, 0)
          ),
    },
  }),
})
