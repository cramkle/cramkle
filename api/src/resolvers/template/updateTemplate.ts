import { GraphQLID, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { TemplateModel } from '../../mongo'
import { ContentStateDocument } from '../../mongo/ContentState'
import { ContentStateInputType } from '../contentState/types'
import { TemplateType } from './types'

interface UpdateTemplateInput {
  id: string
  name?: string
  frontSide?: ContentStateDocument
  backSide?: ContentStateDocument
}

export const updateTemplate = mutationWithClientMutationId({
  name: 'UpdateTemplate',
  description: 'Updates an existing template',
  inputFields: {
    id: { type: GraphQLID, description: 'Template id' },
    name: { type: GraphQLString, description: 'teamplte name' },
    frontSide: {
      type: ContentStateInputType,
      description: 'Front side template',
    },
    backSide: {
      type: ContentStateInputType,
      description: 'Back side template',
    },
  },
  outputFields: {
    template: { type: TemplateType },
  },
  mutateAndGetPayload: (
    { id, name, frontSide, backSide }: UpdateTemplateInput,
    { user }: Context
  ) => {
    const { id: templateId } = fromGlobalId(id)

    const updatedFields: Omit<UpdateTemplateInput, 'id'> = {}

    if (name) {
      updatedFields.name = name
    }

    if (frontSide) {
      updatedFields.frontSide = frontSide
    }

    if (backSide) {
      updatedFields.backSide = backSide
    }

    return {
      template: TemplateModel.findOneAndUpdate(
        {
          _id: templateId,
          ownerId: user?._id,
        },
        updatedFields,
        {
          new: true,
        }
      ),
    }
  },
})
