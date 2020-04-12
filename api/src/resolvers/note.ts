import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, FlashCardModel, ModelModel, NoteModel } from '../models'

export const root: IResolvers = {
  Note: {
    id: (root) => root._id.toString(),
    deck: (root) => DeckModel.findById(root.deckId),
    model: (root) => ModelModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }, { user }: Context) => {
    const note = await NoteModel.findOne({ _id: id, ownerId: user._id })

    if (!note) {
      throw new ApolloError('Note not found')
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
    const deck = await DeckModel.findOne({ _id: deckId, ownerId: user._id })
    const model = await ModelModel.findOne({
      _id: modelId,
      ownerId: user._id,
    })

    if (!deck || !model) {
      throw new ApolloError('Model or deck not found')
    }

    const note = await NoteModel.create({
      modelId,
      deckId,
      cards: model.templates.map(
        (templateId) =>
          new FlashCardModel({
            templateId,
          })
      ),
      values: fieldValues.map((fieldValue: any) => ({
        ...fieldValue,
        field: fieldValue.field.id,
      })),
    })

    await ModelModel.findOneAndUpdate(
      { _id: modelId, ownerId: user._id },
      { $push: { notes: note } }
    )
    await DeckModel.findOneAndUpdate(
      { _id: deckId, ownerId: user._id },
      { $push: { notes: note } }
    )

    return note
  },
}
