import { IResolvers, IResolverObject } from 'graphql-tools'
import { Field, CardModel } from '../../models'

export const root: IResolvers = {
  Field: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
  },
}

export const queries: IResolverObject = {
  field: async (_, { id }) => {
    const field = await Field.findById(id)

    return field
  },
}

export const mutations: IResolverObject = {
  addField: async (_, { name, modelId }, { user }) => {
    const field = await Field.create({ name, modelId, ownerId: user._id })

    await CardModel.findByIdAndUpdate(modelId, {
      $push: { fields: field },
    })

    return field
  },
}
