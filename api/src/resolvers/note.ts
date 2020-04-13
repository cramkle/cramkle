import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, ModelModel, NoteModel } from '../models'
import { NoteDocument } from '../models/Note'

export const root: IResolvers = {
  Note: {
    id: (root: NoteDocument) => root._id.toString(),
    deck: (root: NoteDocument) => DeckModel.findById(root.deckId),
    model: (root: NoteDocument) => ModelModel.findById(root.modelId),
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

interface CreateNoteMutationInput {
  modelId: string
  deckId: string
  fieldValues: Array<{
    data: ContentStateInput
    field: {
      id: string
    }
  }>
}

export const mutations: IResolverObject = {
  createNote: async (
    _,
    { modelId, deckId, fieldValues }: CreateNoteMutationInput,
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
      values: fieldValues.map((fieldValue) => ({
        data: fieldValue.data,
        fieldId: fieldValue.field.id,
      })),
    })

    note.set(
      'cards',
      model.templates.map((templateId) => ({ templateId, noteId: note._id }))
    )

    await note.save()

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
