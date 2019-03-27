import { IResolvers, IResolverObject } from 'graphql-tools'
import { Block, Template, CardModel } from '../../models'

export const root: IResolvers = {
  Template: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
    frontSide: root => Promise.all(root.frontSide.map(Block.findById)),
    backSide: root => Promise.all(root.backSide.map(Block.findById)),
  },
}

export const queries: IResolverObject = {
  template: async (_, { id }) => {
    const template = await Template.findById(id)

    return template
  },
}
