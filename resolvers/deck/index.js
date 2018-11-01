const { Deck, User, Note } = require('../../models')

module.exports = {
  root: {
    Deck: {
      id: root => root._id.toString(),
      owner: root => User.findById(root.ownerId),
      notes: root => Promise.all(root.notes.map(Note.findById)),
    },
  },
  queries: {
    decks: async () => {
      const decks = await Deck.find()

      return decks
    },
    deck: async (_, { id }) => {
      return await Deck.findById(id)
    },
  },
  mutations: {
    createDeck: async (_, { title, description }) => {
      const deck = await Deck.create({ title, description })

      return deck
    },
    updateDeck: async (_, { id, title, description }) => {
      const deck = await Deck.findByIdAndUpdate(id, { title, description })

      return deck
    },
    publishDeck: async (_, { id }) => {
      const deck = await Deck.findByIdAndUpdate(id, { published: true })

      return deck
    },
    unpublishDeck: async (_, { id }) => {
      const deck = await Deck.findByIdAndUpdate(id, { published: false })

      return deck
    },
  },
}
