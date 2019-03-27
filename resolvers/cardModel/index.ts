import { IResolvers, IResolverObject } from 'graphql-tools'
import { CardModel, User, Template, Field } from '../../models'

export const root: IResolvers = {
  CardModel: {
    id: root => root._id.toString(),
    owner: root => User.findById(root.ownerId),
    templates: root => Promise.all(root.templates.map(Template.findById)),
    fields: root => Promise.all(root.fields.map(Field.findById)),
  },
}

export const queries: IResolverObject = {
  cardModel: async (_, { id }) => {
    const cardModel = await CardModel.findById(id)

    return cardModel
  },
}

export const mutations: IResolverObject = {
  createModel: async (_, { name }, { user }) => {
    const cardModel = await CardModel.create({ name, ownerId: user._id })

    return cardModel
  },
  updateModel: async (_, { id: _id, name }, { user }) => {
    return CardModel.findOneAndUpdate({ _id, ownerId: user._id }, { name })
  },
}
