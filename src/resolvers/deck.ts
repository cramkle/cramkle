import { IResolvers, IResolverObject } from 'graphql-tools'

import { findRefFromList } from './utils'
import { Deck, User, Note } from '../models'

export const root: IResolvers = {
  Deck: {
    id: root => root._id.toString(),
    owner: root => User.findById(root.ownerId),
    notes: root => Promise.all(findRefFromList(Note, root.notes)),
  },
}

export const queries: IResolverObject = {
  decks: async (_, __, { user }: Context) => {
    const decks = await Deck.find({ ownerId: user._id })

    return decks
  },
  deck: async (_, { slug }, { user }: Context) => {
    return await Deck.findOne({ slug, ownerId: user._id })
  },
}

export const mutations: IResolverObject = {
  createDeck: async (_, { title, description }, { user }: Context) => {
    const deck = await Deck.create({ title, description, ownerId: user._id })

    return deck
  },
  updateDeck: (_, { id: _id, title, description }, { user }: Context) => {
    return Deck.findOneAndUpdate(
      { _id, ownerId: user._id },
      { title, description },
      { new: true }
    )
  },
  deleteDeck: async (_, { id: _id }, { user }: Context) => {
    return await Deck.findOneAndDelete({ _id, ownerId: user._id }).exec()
  },
  publishDeck: (_, { id: _id }, { user }: Context) => {
    return Deck.findOneAndUpdate(
      { _id, ownerId: user._id },
      { published: true },
      { new: true }
    )
  },
  unpublishDeck: (_, { id: _id }, { user }: Context) => {
    return Deck.findOneAndUpdate(
      { _id, ownerId: user._id },
      { published: false },
      {
        new: true,
      }
    )
  },
}
