import { GraphQLFieldConfig } from 'graphql'

import { UserModel } from '../../mongo'
import { UserType } from './types'

export const me: GraphQLFieldConfig<void, Context> = {
  type: UserType,
  description: 'Get currently logged user',
  resolve: async (_, __, { user }: Context) => {
    if (!user) {
      return null
    }

    const dbUser = await UserModel.findById(user._id).exec()

    return dbUser
  },
}
