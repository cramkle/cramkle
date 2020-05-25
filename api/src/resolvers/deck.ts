import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, NoteModel, UserModel } from '../mongo'
import { DeckDocument } from '../mongo/Deck'
import { FlashCardStatus } from '../mongo/Note'
import { decodeGlobalId, globalIdField } from '../utils/graphqlID'
import {
  PageConnectionArgs,
  connectionFromArray,
  createPageCursors,
  pageToCursor,
} from '../utils/pagination'
import { studyFlashCardsByDeck } from '../utils/study'

type StudySessionDetailsObject = { [status in FlashCardStatus]: number }

export const root: IResolvers = {
  StudySessionDetails: {
    newCount: (root: StudySessionDetailsObject) => root.NEW,
    learningCount: (root: StudySessionDetailsObject) => root.LEARNING,
    reviewCount: (root: StudySessionDetailsObject) => root.REVIEW,
  },
  Deck: {
    id: globalIdField(),
    owner: (root: DeckDocument) => UserModel.findById(root.ownerId),
    studySessionDetails: async (root: DeckDocument) => {
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
    notes: async (root: DeckDocument, args: PageConnectionArgs) => {
      const notes = await NoteModel.find({ deckId: root._id })

      const totalCount = notes.length

      const cursor = pageToCursor(args.page, args.size)
      const connection = connectionFromArray(notes, {
        after: cursor,
        first: args.size,
      })

      return Object.assign(
        {},
        {
          pageCursors: createPageCursors(
            { page: args.page, size: args.size },
            totalCount
          ),
        },
        connection
      )
    },
    totalNotes: (root: DeckDocument) =>
      NoteModel.find({ deckId: root._id }).count(),
    totalFlashcards: (root: DeckDocument) =>
      NoteModel.find({ deckId: root._id })
        .exec()
        .then((notes) =>
          notes.reduce((total, note) => total + note.flashCards.length, 0)
        ),
  },
}

interface DecksArgs {
  studyOnly: boolean
}

export const queries: IResolverObject = {
  decks: async (_, { studyOnly }: DecksArgs, { user }: Context) => {
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
  deck: async (_, { slug }, { user }: Context) => {
    return await DeckModel.findOne({ slug, ownerId: user?._id })
  },
}

export const mutations: IResolverObject = {
  createDeck: async (_, { title, description }, { user }: Context) => {
    const deck = await DeckModel.create({
      title,
      description,
      ownerId: user?._id,
    })

    return deck
  },
  updateDeck: (_, { id, title, description }, { user }: Context) => {
    const { objectId: deckId } = decodeGlobalId(id)

    return DeckModel.findOneAndUpdate(
      { _id: deckId, ownerId: user?._id },
      { title, description },
      { new: true }
    )
  },
  deleteDeck: async (_, { id }, { user }: Context) => {
    const { objectId: deckId } = decodeGlobalId(id)

    return await DeckModel.findOneAndDelete({
      _id: deckId,
      ownerId: user?._id,
    }).exec()
  },
  publishDeck: (_, { id }, { user }: Context) => {
    const { objectId: deckId } = decodeGlobalId(id)

    return DeckModel.findOneAndUpdate(
      { _id: deckId, ownerId: user?._id },
      { published: true },
      { new: true }
    )
  },
  unpublishDeck: (_, { id }, { user }: Context) => {
    const { objectId: deckId } = decodeGlobalId(id)

    return DeckModel.findOneAndUpdate(
      { _id: deckId, ownerId: user?._id },
      { published: false },
      {
        new: true,
      }
    )
  },
}
