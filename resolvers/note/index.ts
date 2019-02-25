import { IResolvers, IResolverObject } from 'graphql-tools'
import { Note, Deck, CardModel, FieldValue, Card } from '../../models'

export const root: IResolvers = {
  Note: {
    id: root => root._id.toString(),
    deck: root => Deck.findById(root.deckId),
    model: root => CardModel.findById(root.modelId),
    values: root => Promise.all(root.values.map(FieldValue.findById)),
    cards: root => Promise.all(root.cards.map(Card.findById)),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }) => {
    const note = await Note.findById(id)

    return note
  },
}
