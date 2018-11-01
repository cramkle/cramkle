const { Note, Deck, CardModel, FieldValues, Card } = require('../../models')

module.exports = {
  root: {
    Note: {
      id: root => root._id.toString(),
      deck: root => Deck.findById(root.deckId),
      model: root => CardModel.findById(root.modelId),
      values: root => Promise.all(root.values.map(FieldValues.findById)),
      cards: root => Promise.all(root.cards.map(Card.findById)),
    },
  },
  queries: {
    note: async (_, { id }) => {
      const note = await Note.findById(id)

      return note
    },
  },
}
