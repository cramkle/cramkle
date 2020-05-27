import { IResolverObject, IResolvers } from 'graphql-tools'

import { DeckModel, ModelModel, NoteModel, TemplateModel } from '../mongo'
import { NoteDocument } from '../mongo/Note'
import { decodeGlobalId, globalIdField } from '../utils/graphqlID'
import { getNoteIdentifier } from '../utils/noteIdentifier'

export const root: IResolvers = {
  Note: {
    id: globalIdField(),
    deck: (root: NoteDocument) => DeckModel.findById(root.deckId),
    model: (root: NoteDocument) => ModelModel.findById(root.modelId),
    text: (root: NoteDocument) => getNoteIdentifier(root),
  },
}

export const queries: IResolverObject = {
  note: async (_, args, { user }: Context) => {
    const { objectId: noteId } = decodeGlobalId(args.id)
    const userDecks = await DeckModel.find({ ownerId: user?._id })

    const note = await NoteModel.findOne({
      _id: noteId,
      deckId: {
        $in: userDecks.map(({ _id }) => _id),
      },
    })

    if (!note) {
      throw new Error('Note not found')
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
  createNote: async (_, args: CreateNoteMutationInput, { user }: Context) => {
    const { fieldValues } = args
    const { objectId: deckId } = decodeGlobalId(args.deckId)
    const { objectId: modelId } = decodeGlobalId(args.modelId)

    const deck = await DeckModel.findOne({ _id: deckId, ownerId: user?._id })
    const model = await ModelModel.findOne({
      _id: modelId,
      ownerId: user?._id,
    })

    if (!deck || !model) {
      throw new Error('Model or deck not found')
    }

    const note = await NoteModel.create({
      modelId,
      deckId,
      ownerId: user!._id,
      values: fieldValues.map((fieldValue) => {
        const { objectId: fieldId } = decodeGlobalId(fieldValue.field.id)

        return {
          data: fieldValue.data,
          fieldId,
        }
      }),
    })

    const modelTemplates = await TemplateModel.find({ modelId: model._id })

    note.set(
      'flashCards',
      modelTemplates.map(({ _id: templateId }) => ({
        templateId,
        noteId: note._id,
      }))
    )

    await note.save()

    return note
  },
  deleteNote: async (_: unknown, args: { noteId: string }, ctx: Context) => {
    const { objectId: noteId } = decodeGlobalId(args.noteId)

    const note = await NoteModel.findOne({
      _id: noteId,
      ownerId: ctx.user?._id,
    })

    if (!note) {
      throw new Error('Note not found')
    }

    await note.remove()

    return note
  },
}
