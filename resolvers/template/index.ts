import { Template, CardModel } from '../../models'

export const root = {
  Template: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
  },
}

export const queries = {
  template: async (_, { id }) => {
    const template = await Template.findById(id)

    return template
  },
}
