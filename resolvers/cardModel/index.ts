import { ApolloError } from 'apollo-server'
import { IResolvers, IResolverObject } from 'graphql-tools'

import { findRefFromList } from '../utils'
import { CardModel, User, Template, Field, Note } from '../../models'
import { Field as FieldType } from '../../models/Field'

export const root: IResolvers = {
  CardModel: {
    id: root => root._id.toString(),
    owner: root => User.findById(root.ownerId),
    templates: root => Promise.all(findRefFromList(Template, root.templates)),
    fields: root => Promise.all(findRefFromList(Field, root.fields)),
    notes: root => Promise.all(findRefFromList(Note, root.notes)),
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
  updateModel: (_, { id: _id, name }, { user }) => {
    return CardModel.findOneAndUpdate({ _id, ownerId: user._id }, { name })
  },
  deleteModel: async (_, { id: _id }, { user }) => {
    const model = await CardModel.findOne({ _id, ownerId: user._id })
      .populate('fields')
      .populate('templates')
      .exec()

    if (!model) {
      return new ApolloError('Model not found', '404')
    }

    await Promise.all(
      model.fields.map(fieldRef => Field.findByIdAndDelete(fieldRef))
    )

    await Promise.all(
      model.templates.map(templateRef =>
        Template.findByIdAndDelete(templateRef)
      )
    )

    await model.remove()

    return model
  },
}
