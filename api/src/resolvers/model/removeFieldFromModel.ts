import {
  GraphQLError,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { FieldModel, ModelModel } from '../../mongo'
import { FieldType } from '../field/types'

interface RemoveFieldInput {
  fieldId: string
}

export const removeFieldFromModel: GraphQLFieldConfig<
  void,
  Context,
  RemoveFieldInput
> = mutationWithClientMutationId({
  name: 'RemoveFieldFromModel',
  description: "Removes the field from it's model",
  inputFields: {
    fieldId: { type: GraphQLNonNull(GraphQLID), description: 'Field id' },
  },
  outputFields: {
    field: { type: FieldType },
  },
  mutateAndGetPayload: async (args: RemoveFieldInput, { user }: Context) => {
    const { id: fieldId } = fromGlobalId(args.fieldId)

    const field = await FieldModel.findById(fieldId)

    const fieldModel = await ModelModel.findOne({
      _id: field?.modelId,
      ownerId: user?._id,
    })

    if (!field || !fieldModel) {
      throw new GraphQLError('Field not found')
    }

    await field.remove()

    return { field }
  },
})
