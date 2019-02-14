const { Deck, User, Note } = require('../../models')
const { UnauthorizedError } = require('../../models/errors')

module.exports = {
  root: {
    Deck: {
      id: root => root._id.toString(),
      owner: root => User.findById(root.ownerId),
      notes: root => Promise.all(root.notes.map(Note.findById)),
    },
  },
  queries: {
    decks: async (_, __, { req: { user } }) => {
      const decks = await Deck.find({ ownerId: user._id })

      return decks
    },
    deck: async (_, { slug }, { req: { user } }) => {
      return await Deck.findOne({ slug, ownerId: user._id })
    },
  },
  mutations: {
    createDeck: async (_, { title, description }, { req: { user } }) => {
      if (!user) {
        throw new UnauthorizedError()
      }

      const deck = await Deck.create({ title, description, ownerId: user._id })

      return deck
    },
    updateDeck: async (_, { id, title, description }, { req: { user } }) => {
      if (!user) {
        throw new UnauthorizedError()
      }

      const deck = await Deck.findOneAndUpdate(
        { id, ownerId: user._id },
        { title, description }
      )

      return deck
    },
    publishDeck: async (_, { id }, { req: { user } }) => {
      if (!user) {
        throw new UnauthorizedError()
      }

      const deck = await Deck.findOneAndUpdate(
        { id, ownerId: user._id },
        { published: true }
      )

      return deck
    },
    unpublishDeck: async (_, { id }, { req: { user } }) => {
      if (!user) {
        throw new UnauthorizedError()
      }

      const deck = await Deck.findOneAndUpdate(
        { id, ownerId: user._id },
        { published: false }
      )

      return deck
    },
  },
}
