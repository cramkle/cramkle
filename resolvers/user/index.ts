import { AuthenticationError } from 'apollo-server'
import { filter, isNil, compose, not } from 'ramda'
import { IResolvers, IResolverObject } from 'graphql-tools'
import { User } from '../../models'

export const root: IResolvers = {
  User: {
    id: root => root._id.toString(),
  },
}

export const queries: IResolverObject = {
  user: async (_, __, { user }) => {
    if (!user) {
      return null
    }

    const dbUser = await User.findById(user._id).exec()

    return dbUser
  },
}

export const mutations: IResolverObject = {
  updateProfile: async (
    _,
    { email, username, password, confirmPassword },
    { user }
  ) => {
    if (!(await user.comparePassword(confirmPassword))) {
      return new AuthenticationError('User not authenticated')
    }

    const updateProps = filter(
      compose(
        not,
        isNil
      ),
      { email, username, password }
    )

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
