import { ApolloError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'

import { findRefFromList } from './utils'
import {
  FieldModel,
  ModelModel,
  NoteModel,
  TemplateModel,
  UserModel,
} from '../models'
import { Field as FieldType } from '../models/Field'
import { Template as TemplateType } from '../models/Template'
import { ModelDocument } from '../models/Model'

export const root: IResolvers = {
  CardModel: {
    id: (root: ModelDocument) => root._id.toString(),
    owner: (root: ModelDocument) => UserModel.findById(root.ownerId),
    primaryField: (root: ModelDocument) => {
      if (!root.primaryFieldId && !root.fields.length) {
        return null
      }

      if (root.primaryFieldId) {
        return FieldModel.findById(root.primaryFieldId)
      }

      return FieldModel.findById(root.fields[0])
    },
    templates: (root: ModelDocument) =>
      Promise.all(findRefFromList(TemplateModel, root.templates)),
    fields: (root: ModelDocument) =>
      Promise.all(findRefFromList(FieldModel, root.fields)),
    notes: (root: ModelDocument) =>
      Promise.all(findRefFromList(NoteModel, root.notes)),
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
    const fieldRefs = await Promise.all(
      fields.map((field) => FieldModel.create(field))
    )

    const templateRefs = await Promise.all(
      templates.map(async (template) => {
        return TemplateModel.create({
          ...template,
          ownerId: user?._id,
        })
      })
    )

    const cardModel = await ModelModel.create({
      name,
      fields: fieldRefs,
      templates: templateRefs,
      ownerId: user?._id,
      primaryFieldId: fieldRefs[0]._id,
    })

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
      .populate('fields')
      .populate('templates')
      .populate('notes')
      .exec()

    if (!model) {
      throw new ApolloError('Model not found', '404')
    }

    await Promise.all(
      model.fields.map((fieldRef) => FieldModel.findByIdAndDelete(fieldRef))
    )

    await Promise.all(
      model.templates.map((templateRef) =>
        TemplateModel.findByIdAndDelete(templateRef)
      )
    )

    await Promise.all(
      model.notes.map((noteRef) => NoteModel.findByIdAndDelete(noteRef))
    )

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

    await ModelModel.findByIdAndUpdate(modelId, {
      $push: { templates: template },
    })

    return template
  },
  addFieldToModel: async (
    _,
    { name, modelId }: AddFieldInput,
    { user }: Context
  ) => {
    const field = await FieldModel.create({ name, modelId, ownerId: user?._id })

    await ModelModel.findByIdAndUpdate(modelId, {
      $push: { fields: field },
    })

    return field
  },
}
