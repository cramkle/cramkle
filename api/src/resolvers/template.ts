import { IResolverObject, IResolvers } from 'graphql-tools'

import { CardModel, Template } from '../models'
import { ContentStateDocument } from '../models/ContentState'

export const root: IResolvers = {
  Template: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  template: async (_, { id }) => {
    const template = await Template.findById(id)

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

    return Template.findOneAndUpdate(
      {
        _id,
        ownerId: user._id,
      },
      updatedFields,
      {
        new: true,
      }
    )
  },
}
