import { GraphQLBoolean, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { Types } from 'mongoose'

import { UserModel } from '../../mongo'
import { createHashWithTimestamp } from './utils'

interface RequestPasswordResetArgs {
  email: string
}

export const requestPasswordReset = mutationWithClientMutationId({
  name: 'RequestPasswordReset',
  description: 'Request a user password reset given an email',
  inputFields: {
    email: { type: GraphQLString, description: "User's email" },
  },
  outputFields: {
    success: {
      type: GraphQLBoolean,
      description: 'Whether we could successfully send the email or not',
    },
  },
  mutateAndGetPayload: async ({ email }: RequestPasswordResetArgs) => {
    const user = await UserModel.findOne({ email })

    if (!user) {
      return { success: false }
    }

    const userId = user._id as Types.ObjectId

    const todayTimestamp = Date.now()

    const hashString = createHashWithTimestamp(todayTimestamp, user)

    // should send email instead
    console.log(`/reset/${userId}/${todayTimestamp.toString(36)}-${hashString}`)

    return { success: true }
  },
})
