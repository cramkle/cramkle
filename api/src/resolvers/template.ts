import { IResolverObject, IResolvers } from 'graphql-tools'

import { ModelModel, TemplateModel } from '../mongo'
import { ContentStateDocument } from '../mongo/ContentState'
import { TemplateDocument } from '../mongo/Template'

export const root: IResolvers = {
  Template: {
    id: (root: TemplateDocument) => root._id.toString(),
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
    { id: _id, name, frontSide, backSide }: UpdateTemplateInput,
    { user }: Context
  ) => {
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
        _id,
        ownerId: user?._id,
      },
      updatedFields,
      {
        new: true,
      }
    )
  },
}
