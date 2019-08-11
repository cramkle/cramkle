import { IResolvers, IResolverObject } from 'graphql-tools'

import { Note, Deck, CardModel } from '../../models'

export const root: IResolvers = {
  Note: {
    id: root => root._id.toString(),
    deck: root => Deck.findById(root.deckId),
    model: root => CardModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }) => {
    const note = await Note.findById(id)

    return note
  },
}

export const mutations: IResolverObject = {
  createNote: async (_, { modelId, deckId, fieldValues }, { user }) => {
    const note = new Note({
      modelId,
      deckId,
      values: fieldValues,
    })
  },
}
