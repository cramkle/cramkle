import { differenceInHours } from 'date-fns'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { UserModel } from '../../mongo'
import { createHashWithTimestamp } from './utils'

interface ResetPasswordArgs {
  token: string
  timestamp: string
  userId: string
  newPassword: string
}

export const resetPassword = mutationWithClientMutationId({
  name: 'ResetPassword',
  description: "Resets the user's password",
  inputFields: {
    token: { type: GraphQLNonNull(GraphQLString) },
    timestamp: { type: GraphQLNonNull(GraphQLString) },
    userId: { type: GraphQLNonNull(GraphQLID) },
    newPassword: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: { type: GraphQLBoolean },
  },
  mutateAndGetPayload: async ({
    timestamp,
    token,
    userId,
    newPassword,
  }: ResetPasswordArgs) => {
    const user = await UserModel.findById(userId)

    if (!user) {
      return { success: false }
    }

    const parsedTimestamp = parseInt(timestamp, 36)

    if (token !== createHashWithTimestamp(parsedTimestamp, user)) {
      return { success: false }
    }

    if (differenceInHours(parsedTimestamp, Date.now()) > 24) {
      return { success: false }
    }

    user.password = newPassword
    await user.hashifyAndSave()

    return { success: true }
  },
})
