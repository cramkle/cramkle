import { GraphQLID, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { TemplateModel } from '../../mongo'
import { ContentStateDocument } from '../../mongo/ContentState'
import { ContentStateInputType } from '../contentState/types'
import { parseContentStateWithGlobalId } from '../contentState/utils'
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
    name: { type: GraphQLString, description: 'template name' },
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
    { id, ...updatedFields }: UpdateTemplateInput,
    { user }: Context
  ) => {
    const { id: templateId } = fromGlobalId(id)

    if (updatedFields.frontSide) {
      updatedFields.frontSide = parseContentStateWithGlobalId(
        updatedFields.frontSide
      ) as ContentStateDocument
    }

    if (updatedFields.backSide) {
      updatedFields.backSide = parseContentStateWithGlobalId(
        updatedFields.backSide
      ) as ContentStateDocument
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
