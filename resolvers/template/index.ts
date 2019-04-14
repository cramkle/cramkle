import { IResolvers, IResolverObject } from 'graphql-tools'

import { ContentState, Template, CardModel } from '../../models'

export const root: IResolvers = {
  Template: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
    frontSide: root => ContentState.findById(root.frontSideId),
    backSide: root => ContentState.findById(root.backSideId),
  },
}

export const queries: IResolverObject = {
  template: async (_, { id }) => {
    const template = await Template.findById(id)

    return template
  },
}

export const mutations: IResolverObject = {
  addTemplate: async (_, { name, modelId }, { user }) => {
    const frontSideRef = await ContentState.create({ ownerId: user._id })
    const backSideRef = await ContentState.create({ ownerId: user._id })

    const template = await Template.create({
      name,
      modelId,
      frontSideId: frontSideRef._id,
      backSideId: backSideRef._id,
      ownerId: user._id,
    })

    await CardModel.findByIdAndUpdate(modelId, {
      $push: { templates: template },
    })

    return template
  },
  updateTemplate: async (_, { id: _id, name }, { user }) => {
    return Template.findOneAndUpdate(
      {
        _id,
        ownerId: user._id,
      },
      { name }
    )
  },
}
