import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { DeckModel, ModelModel, NoteModel, TemplateModel } from '../../mongo'
import { NoteType } from '../deck/types'
import { FieldValueInput } from '../fieldValue/types'

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

export const createNote = mutationWithClientMutationId({
  name: 'CreateNote',
  description: 'Creates a new note in a deck',
  inputFields: {
    modelId: { type: GraphQLID, description: 'Model of the note' },
    deckId: { type: GraphQLID, description: 'Deck to add this note' },
    fieldValues: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FieldValueInput))),
      description: 'Values of this note, according to the model fields',
    },
  },
  outputFields: { note: { type: NoteType } },
  mutateAndGetPayload: async (args: CreateNoteMutationInput, { user }) => {
    const { fieldValues } = args
    const { id: deckId } = fromGlobalId(args.deckId)
    const { id: modelId } = fromGlobalId(args.modelId)

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
        const { id: fieldId } = fromGlobalId(fieldValue.field.id)

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

    return { note }
  },
})
