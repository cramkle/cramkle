import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { findRefFromList } from './utils'
import { CardModel, Field, Note, Template, User } from '../models'
import { Field as FieldType } from '../models/Field'
import { Template as TemplateType } from '../models/Template'

export const root: IResolvers = {
  CardModel: {
    id: (root) => root._id.toString(),
    owner: (root) => User.findById(root.ownerId),
    templates: (root) => Promise.all(findRefFromList(Template, root.templates)),
    fields: (root) => Promise.all(findRefFromList(Field, root.fields)),
    notes: (root) => Promise.all(findRefFromList(Note, root.notes)),
  },
}

export const queries: IResolverObject = {
  cardModel: async (_, { id }) => {
    const cardModel = await CardModel.findById(id)

    return cardModel
  },
  cardModels: async (_, __, { user }: Context) => {
    return CardModel.find({ ownerId: user._id })
  },
}

interface CreateModelInput {
  name: string
  fields: FieldType[]
  templates: TemplateType[]
}

interface UpdateModelInput {
  id: string
  name: string
}

interface AddTemplateInput {
  modelId: string
  name: string
}

interface AddFieldInput {
  modelId: string
  name: string
}

export const mutations: IResolverObject = {
  createModel: async (
    _,
    { name, fields, templates }: CreateModelInput,
    { user }: Context
  ) => {
    const fieldRefs = await Promise.all(
      fields.map((field) => Field.create(field))
    )

    const templateRefs = await Promise.all(
      templates.map(async (template) => {
        return Template.create({
          ...template,
          ownerId: user._id,
        })
      })
    )

    const cardModel = await CardModel.create({
      name,
      fields: fieldRefs,
      templates: templateRefs,
      ownerId: user._id,
    })

    return cardModel
  },
  updateModel: (_, { id: _id, name }: UpdateModelInput, { user }: Context) => {
    return CardModel.findOneAndUpdate(
      { _id, ownerId: user._id },
      { name },
      { new: true }
    )
  },
  deleteModel: async (_, { id: _id }, { user }: Context) => {
    const model = await CardModel.findOne({ _id, ownerId: user._id })
      .populate('fields')
      .populate('templates')
      .exec()

    if (!model) {
      throw new ApolloError('Model not found', '404')
    }

    await Promise.all(
      model.fields.map((fieldRef) => Field.findByIdAndDelete(fieldRef))
    )

    await Promise.all(
      model.templates.map((templateRef) =>
        Template.findByIdAndDelete(templateRef)
      )
    )

    await model.remove()

    return model
  },
  addTemplateToModel: async (
    _,
    { name, modelId }: AddTemplateInput,
    { user }: Context
  ) => {
    const template = await Template.create({
      name,
      modelId,
      ownerId: user._id,
    })

    await CardModel.findByIdAndUpdate(modelId, {
      $push: { templates: template },
    })

    return template
  },
  addFieldToModel: async (
    _,
    { name, modelId }: AddFieldInput,
    { user }: Context
  ) => {
    const field = await Field.create({ name, modelId, ownerId: user._id })

    await CardModel.findByIdAndUpdate(modelId, {
      $push: { fields: field },
    })

    return field
  },
}
