import { IResolvers, IResolverObject } from 'graphql-tools'
import { Template, CardModel } from '../../models'

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
