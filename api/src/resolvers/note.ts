import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, ModelModel, NoteModel, TemplateModel } from '../mongo'
import { NoteDocument } from '../mongo/Note'

export const root: IResolvers = {
  Note: {
    id: (root: NoteDocument) => root._id.toString(),
    deck: (root: NoteDocument) => DeckModel.findById(root.deckId),
    model: (root: NoteDocument) => ModelModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  note: async (_, { id }, { user }: Context) => {
    const userDecks = await DeckModel.find({ ownerId: user?._id })

    const note = await NoteModel.findOne({
      _id: id,
      deckId: {
        $in: userDecks.map(({ _id }) => _id),
      },
    })

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
    const deck = await DeckModel.findOne({ _id: deckId, ownerId: user?._id })
    const model = await ModelModel.findOne({
      _id: modelId,
      ownerId: user?._id,
    })

    if (!deck || !model) {
      throw new ApolloError('Model or deck not found')
    }

    const note = await NoteModel.create({
      modelId,
      deckId,
      ownerId: user!.id,
      values: fieldValues.map((fieldValue) => ({
        data: fieldValue.data,
        fieldId: fieldValue.field.id,
      })),
    })

    const modelTemplates = await TemplateModel.find({ modelId: model._id })

    note.set(
      'cards',
      modelTemplates.map(({ _id: templateId }) => ({
        templateId,
        noteId: note._id,
      }))
    )

    await note.save()

    return note
  },
  deleteNote: async (
    _: unknown,
    { noteId }: { noteId: string },
    ctx: Context
  ) => {
    const note = await NoteModel.findOne({ _id: noteId, ownerId: ctx.user?.id })

    if (!note) {
      throw new ApolloError('Note not found')
    }

    await note.remove()

    return note
  },
}
