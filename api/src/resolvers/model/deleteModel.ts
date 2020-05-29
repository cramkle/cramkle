import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { FieldModel, ModelModel, NoteModel, TemplateModel } from '../../mongo'
import { ModelType } from './types'

export const deleteModel: GraphQLFieldConfig<
  void,
  Context,
  { id: string }
> = mutationWithClientMutationId({
  name: 'DeleteModel',
  description:
    'Deletes a model and all associated entities (such as flashcards and templates).',
  inputFields: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    model: { type: ModelType },
  },
  mutateAndGetPayload: async ({ id }, { user }: Context) => {
    const { id: modelId } = fromGlobalId(id)

    const model = await ModelModel.findOne({ _id: modelId, ownerId: user?._id })

    if (!model) {
      throw new Error('Model not found')
    }

    await FieldModel.deleteMany({ modelId: model._id })

    await TemplateModel.deleteMany({ modelId: model._id })

    await NoteModel.deleteMany({ modelId: model._id })

    await model.remove()

    return { model }
  },
})
