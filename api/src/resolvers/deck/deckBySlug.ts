import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'

import { DeckModel } from '../../mongo'
import { DeckType } from './types'

interface DeckArgs {
  slug: string
}

export const deck: GraphQLFieldConfig<void, Context, DeckArgs> = {
  type: DeckType,
  description: "Get single deck by it's slug",
  args: {
    slug: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { slug }, { user }) => {
    return await DeckModel.findOne({ slug, ownerId: user?._id })
  },
}
