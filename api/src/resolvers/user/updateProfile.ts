import { GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { UserType } from './types'

interface UpdateProfileInput {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export const updateProfile = mutationWithClientMutationId({
  name: 'UpdateProfile',
  description: 'Update user profile information',
  inputFields: {
    email: {
      type: GraphQLString,
      description: 'New email',
    },
    username: { type: GraphQLString, description: 'New username' },
    password: { type: GraphQLString, description: 'New password' },
    confirmPassword: {
      type: GraphQLString,
      description: 'Password confirmation',
    },
  },
  outputFields: { user: { type: UserType } },
  mutateAndGetPayload: async (
    { email, username, password, confirmPassword }: UpdateProfileInput,
    { user }: Context
  ) => {
    if (!(await user?.comparePassword(confirmPassword))) {
      throw new Error('User not authenticated')
    }

    const updateProps: Partial<Omit<UpdateProfileInput, 'confirmPassword'>> = {}

    if (email) {
      updateProps.email = email
    }

    if (username) {
      updateProps.username = username
    }

    if (password) {
      updateProps.password = password
    }

    Object.assign(user, updateProps)

    await user?.save()

    return { user }
  },
})
