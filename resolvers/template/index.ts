import { IResolvers, IResolverObject } from 'graphql-tools'

import { findRefFromList } from '../utils'
import { Block, Template, CardModel } from '../../models'

export const root: IResolvers = {
  Template: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
    frontSide: root => Promise.all(findRefFromList(Block, root.frontSide)),
    backSide: root => Promise.all(findRefFromList(Block, root.backSide)),
  },
}

export const queries: IResolverObject = {
  template: async (_, { id }) => {
    const template = await Template.findById(id)

    return template
  },
}

export const mutations: IResolverObject = {
  createTemplate: async (
    _,
    { name, frontSide, backSide, modelId },
    { user }
  ) => {
    const template = await Template.create({
      name,
      modelId,
      frontSide,
      backSide,
      ownerId: user._id,
    })

    return template
  },
  updateTemplate: async (
    _,
    { id: _id, name, frontSide, backSide },
    { user }
  ) => {
    return Template.findOneAndUpdate(
      {
        _id,
        ownerId: user._id,
      },
      { name, frontSide, backSide }
    )
  },
}
