import { GraphQLFieldConfig, GraphQLID } from 'graphql'

import { TemplateModel } from '../../mongo'
import { TemplateType } from './types'

export const template: GraphQLFieldConfig<void, Context, { id: string }> = {
  type: TemplateType,
  description: "Get single template by it's id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }) => {
    const template = await TemplateModel.findById(id)

    return template
  },
}
