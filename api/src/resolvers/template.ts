import { IResolverObject, IResolvers } from 'graphql-tools'

import { ModelModel, TemplateModel } from '../mongo'
import { ContentStateDocument } from '../mongo/ContentState'
import { TemplateDocument } from '../mongo/Template'
import { decodeGlobalId, globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  Template: {
    id: globalIdField(),
    model: (root: TemplateDocument) => ModelModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  template: async (_, { id }) => {
    const template = await TemplateModel.findById(id)

    return template
  },
}

interface UpdateTemplateInput {
  id: string
  name?: string
  frontSide?: ContentStateDocument
  backSide?: ContentStateDocument
}

export const mutations: IResolverObject = {
  updateTemplate: (
    _,
    { id, name, frontSide, backSide }: UpdateTemplateInput,
    { user }: Context
  ) => {
    const { objectId: templateId } = decodeGlobalId(id)

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

    return TemplateModel.findOneAndUpdate(
      {
        _id: templateId,
        ownerId: user?._id,
      },
      updatedFields,
      {
        new: true,
      }
    )
  },
}
