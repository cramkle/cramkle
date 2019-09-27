import { AuthenticationError } from 'apollo-server'
import { IResolverObject, IResolvers } from 'graphql-tools'
import { User } from '../models'

export const root: IResolvers = {
  User: {
    id: root => root._id.toString(),
  },
}

export const queries: IResolverObject = {
  me: async (_, __, { user }: Context) => {
    if (!user) {
      return null
    }

    const dbUser = await User.findById(user._id).exec()

    return dbUser
  },
}

interface UpdateProfileInput {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export const mutations: IResolverObject = {
  updateProfile: async (
    _,
    { email, username, password, confirmPassword }: UpdateProfileInput,
    { user }: Context
  ) => {
    if (!(await user.comparePassword(confirmPassword))) {
      return new AuthenticationError('User not authenticated')
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

    await user.save()

    return user
  },
  createUser: async (_, { username, email, password }) => {
    const user = new User({ username, email, password })

    const validation = user.validateSync()

    if (validation) {
      const error = Object.values(validation.errors)[0]
      return Promise.reject(error)
    }

    await user.hashifyAndSave()

    return user
  },
}
