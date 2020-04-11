import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { Card, CardModel, Deck, Note } from '../models'

export const root: IResolvers = {
  Note: {
    id: (root) => root._id.toString(),
    deck: (root) => Deck.findById(root.deckId),
    model: (root) => CardModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }, { user }: Context) => {
    const note = await Note.findOne({ _id: id, ownerId: user._id })

    if (!note) {
      return new ApolloError('Note not found')
    }

    return note
  },
}

export const mutations: IResolverObject = {
  createNote: async (
    _,
    { modelId, deckId, fieldValues },
    { user }: Context
  ) => {
    const deck = await Deck.findOne({ _id: deckId, ownerId: user._id })
    const model = await CardModel.findOne({ _id: modelId, ownerId: user._id })

    if (!deck || !model) {
      return new ApolloError('Model or deck not found')
    }

    const note = await Note.create({
      modelId,
      deckId,
      cards: model.templates.map(
        (templateId) =>
          new Card({
            templateId,
          })
      ),
      values: fieldValues.map((fieldValue: any) => ({
        ...fieldValue,
        field: fieldValue.field.id,
      })),
    })

    await CardModel.findOneAndUpdate(
      { _id: modelId, ownerId: user._id },
      { $push: { notes: note } }
    )
    await Deck.findOneAndUpdate(
      { _id: deckId, ownerId: user._id },
      { $push: { notes: note } }
    )

    return note
  },
}
