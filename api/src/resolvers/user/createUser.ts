import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { UserModel } from '../../mongo'
import { UserType } from './types'

interface CreateUserArgs {
  username: string
  email: string
  password: string
}

export const createUser = mutationWithClientMutationId({
  name: 'CreateUser',
  description: 'Create a new user',
  inputFields: {
    username: {
      type: GraphQLNonNull(GraphQLString),
      description: "User's username",
    },
    email: { type: GraphQLNonNull(GraphQLString), description: "User's email" },
    password: {
      type: GraphQLNonNull(GraphQLString),
      description: "User's password",
    },
  },
  outputFields: { user: { type: UserType, description: 'Created user' } },
  mutateAndGetPayload: async ({
    username,
    email,
    password,
  }: CreateUserArgs) => {
    const user = new UserModel({ username, email, password })

    const validation = user?.validateSync()

    if (validation) {
      const error = Object.values(validation.errors)[0]
      return Promise.reject(error)
    }

    await user?.hashifyAndSave()

    return user
  },
})
