import { IResolvers, IResolverObject } from 'graphql-tools'
import { CardModel, User, Template, Field } from '../../models'
import { Field as FieldType } from '../../models/Field'

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
  cardModels: async (_, __, { user }) => {
    return CardModel.find({ ownerId: user._id })
  },
}

export const mutations: IResolverObject = {
  createModel: async (
    _,
    { name, fields }: { name: string; fields: FieldType[] },
    { user }
  ) => {
    const fieldRefs = await Promise.all(
      fields.map(field => Field.create(field))
    )

    const cardModel = await CardModel.create({
      name,
      fields: fieldRefs,
      ownerId: user._id,
    })

    return cardModel
  },
  updateModel: async (_, { id: _id, name }, { user }) => {
    return CardModel.findOneAndUpdate({ _id, ownerId: user._id }, { name })
  },
}
