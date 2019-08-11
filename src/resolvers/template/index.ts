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

export const mutations: IResolverObject = {
  addTemplate: async (_, { name, modelId }, { user }) => {
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
  updateTemplate: (_, { id: _id, name, frontSide, backSide }, { user }) => {
    const updatedFields: { [name: string]: any } = { name, frontSide, backSide }

    for (const key of Object.keys(updatedFields)) {
      if (updatedFields[key] == null) {
        delete updatedFields[key]
      }
    }

    return Template.findOneAndUpdate(
      {
        _id,
        ownerId: user._id,
      },
      updatedFields,
      {
        new: true,
      }
    )
  },
}
