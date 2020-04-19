import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import {
  FieldModel,
  ModelModel,
  NoteModel,
  TemplateModel,
  UserModel,
} from '../mongo'
import { Field as FieldType } from '../mongo/Field'
import { ModelDocument } from '../mongo/Model'
import { Template as TemplateType } from '../mongo/Template'

export const root: IResolvers = {
  CardModel: {
    id: (root: ModelDocument) => root._id.toString(),
    owner: (root: ModelDocument) => UserModel.findById(root.ownerId),
    primaryField: async (root: ModelDocument) => {
      const modelFields = await FieldModel.find({ modelId: root._id })

      if (!root.primaryFieldId && !modelFields.length) {
        return null
      }

      if (root.primaryFieldId) {
        return modelFields.find(
          ({ _id }) => root.primaryFieldId === _id.toString()
        )
      }

      return modelFields[0]
    },
    templates: (root: ModelDocument) =>
      TemplateModel.find({ modelId: root._id }),
    fields: (root: ModelDocument) => FieldModel.find({ modelId: root._id }),
    notes: (root: ModelDocument) => NoteModel.find({ modelId: root._id }),
  },
}

export const queries: IResolverObject = {
  cardModel: async (_, { id }) => {
    const cardModel = await ModelModel.findById(id)

    return cardModel
  },
  cardModels: async (_, __, { user }: Context) => {
    return ModelModel.find({ ownerId: user?._id })
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
    const cardModel = await ModelModel.create({
      name,
      ownerId: user?._id,
    })

    await Promise.all(
      fields.map((field) =>
        FieldModel.create({ ...field, modelId: cardModel._id })
      )
    )

    await Promise.all(
      templates.map((template) =>
        TemplateModel.create({
          ...template,
          modelId: cardModel._id,
          ownerId: user?._id,
        })
      )
    )

    return cardModel
  },
  updateModel: (_, { id: _id, name }: UpdateModelInput, { user }: Context) => {
    return ModelModel.findOneAndUpdate(
      { _id, ownerId: user?._id },
      { name },
      { new: true }
    )
  },
  deleteModel: async (_, { id: _id }, { user }: Context) => {
    const model = await ModelModel.findOne({ _id, ownerId: user?._id })

    if (!model) {
      throw new ApolloError('Model not found', '404')
    }

    await FieldModel.deleteMany({ modelId: model._id })

    await TemplateModel.deleteMany({ modelId: model._id })

    await NoteModel.deleteMany({ modelId: model._id })

    await model.remove()

    return model
  },
  addTemplateToModel: async (
    _,
    { name, modelId }: AddTemplateInput,
    { user }: Context
  ) => {
    const template = await TemplateModel.create({
      name,
      modelId,
      ownerId: user?._id,
    })

    return template
  },
  addFieldToModel: async (
    _,
    { name, modelId }: AddFieldInput,
    { user }: Context
  ) => {
    const field = await FieldModel.create({ name, modelId, ownerId: user?._id })

    return field
  },
}
