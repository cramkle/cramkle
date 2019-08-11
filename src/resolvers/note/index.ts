import { IResolvers, IResolverObject } from 'graphql-tools'

import { findRefFromList } from '../utils'
import { Note, Deck, CardModel, FieldValue } from '../../models'

export const root: IResolvers = {
  Note: {
    id: root => root._id.toString(),
    deck: root => Deck.findById(root.deckId),
    model: root => CardModel.findById(root.modelId),
    values: root => Promise.all(findRefFromList(FieldValue, root.values)),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }) => {
    const note = await Note.findById(id)

    return note
  },
}
