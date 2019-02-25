import { Field, CardModel } from '../../models'

export const root = {
  Field: {
    id: root => root._id.toString(),
    model: root => CardModel.findById(root.modelId),
  },
}

export const queries = {
  field: async (_, { id }) => {
    const field = await Field.findById(id)

    return field
  },
}
