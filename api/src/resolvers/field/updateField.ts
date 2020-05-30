import { GraphQLError, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { FieldModel, ModelModel } from '../../mongo'
import { FieldType } from './types'

interface UpdateFieldInput {
  id: string
  name: string
}

export const updateField = mutationWithClientMutationId({
  name: 'UpdateField',
  description: 'Updates an existing field',
  inputFields: {
    id: { type: GraphQLNonNull(GraphQLID), description: 'Field id' },
    name: { type: GraphQLNonNull(GraphQLString), description: 'Field name' },
  },
  outputFields: {
    field: { type: FieldType },
  },
  mutateAndGetPayload: async (
    { id, name }: UpdateFieldInput,
    { user }: Context
  ) => {
    const { id: fieldId } = fromGlobalId(id)

    const field = await FieldModel.findById(fieldId)

    const fieldModel = await ModelModel.findOne({
      _id: field?.modelId,
      ownerId: user?._id,
    })

    if (!fieldModel || !field) {
      throw new GraphQLError('User is not authorized')
    }

    field.name = name

    await field.save()

    return {
      field,
    }
  },
})
