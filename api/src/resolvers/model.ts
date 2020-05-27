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
import { decodeGlobalId, globalIdField } from '../utils/graphqlID'
import { getModelPrimaryField } from '../utils/modelPrimaryField'

export const root: IResolvers = {
  Model: {
    id: globalIdField(),
    owner: (root: ModelDocument) => UserModel.findById(root.ownerId),
    primaryField: (root: ModelDocument) => getModelPrimaryField(root),
    templates: (root: ModelDocument) =>
      TemplateModel.find({ modelId: root._id }),
    fields: (root: ModelDocument) => FieldModel.find({ modelId: root._id }),
    notes: (root: ModelDocument) => NoteModel.find({ modelId: root._id }),
  },
}

export const queries: IResolverObject = {
  model: async (_, args, ctx: Context) => {
    const { objectId: modelId } = decodeGlobalId(args.id)

    const model = await ModelModel.findOne({
      _id: modelId,
      ownerId: ctx.user!._id,
    })

    return model
  },
  models: async (_, __, { user }: Context) => {
    return ModelModel.find({ ownerId: user!._id })
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
    const model = await ModelModel.create({
      name,
      ownerId: user?._id,
    })

    await Promise.all(
      fields.map((field) => FieldModel.create({ ...field, modelId: model._id }))
    )

    await Promise.all(
      templates.map((template) =>
        TemplateModel.create({
          ...template,
          modelId: model._id,
          ownerId: user?._id,
        })
      )
    )

    return model
  },
  updateModel: (_, { id, name }: UpdateModelInput, { user }: Context) => {
    const { objectId: modelId } = decodeGlobalId(id)

    return ModelModel.findOneAndUpdate(
      { _id: modelId, ownerId: user?._id },
      { name },
      { new: true }
    )
  },
  deleteModel: async (_, { id }, { user }: Context) => {
    const { objectId: modelId } = decodeGlobalId(id)

    const model = await ModelModel.findOne({ _id: modelId, ownerId: user?._id })

    if (!model) {
      throw new Error('Model not found')
    }

    await FieldModel.deleteMany({ modelId: model._id })

    await TemplateModel.deleteMany({ modelId: model._id })

    await NoteModel.deleteMany({ modelId: model._id })

    await model.remove()

    return model
  },
  addTemplateToModel: async (_, args: AddTemplateInput, { user }: Context) => {
    const { objectId: modelId } = decodeGlobalId(args.modelId)

    const template = await TemplateModel.create({
      name: args.name,
      modelId,
      ownerId: user?._id,
    })

    return template
  },
  addFieldToModel: async (_, args: AddFieldInput, { user }: Context) => {
    const { objectId: modelId } = decodeGlobalId(args.modelId)

    const field = await FieldModel.create({
      name: args.name,
      modelId,
      ownerId: user?._id,
    })

    return field
  },
}
