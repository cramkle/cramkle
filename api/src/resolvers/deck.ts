import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, NoteModel, UserModel } from '../mongo'
import { DeckDocument } from '../mongo/Deck'
import { studyFlashCardsByDeck } from '../utils/study'

export const root: IResolvers = {
  Deck: {
    id: (root: DeckDocument) => root._id.toString(),
    owner: (root: DeckDocument) => UserModel.findById(root.ownerId),
    notes: (root: DeckDocument) => NoteModel.find({ deckId: root._id }),
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
  updateDeck: (_, { id: _id, title, description }, { user }: Context) => {
    return DeckModel.findOneAndUpdate(
      { _id, ownerId: user?._id },
      { title, description },
      { new: true }
    )
  },
  deleteDeck: async (_, { id: _id }, { user }: Context) => {
    return await DeckModel.findOneAndDelete({ _id, ownerId: user?._id }).exec()
  },
  publishDeck: (_, { id: _id }, { user }: Context) => {
    return DeckModel.findOneAndUpdate(
      { _id, ownerId: user?._id },
      { published: true },
      { new: true }
    )
  },
  unpublishDeck: (_, { id: _id }, { user }: Context) => {
    return DeckModel.findOneAndUpdate(
      { _id, ownerId: user?._id },
      { published: false },
      {
        new: true,
      }
    )
  },
}
