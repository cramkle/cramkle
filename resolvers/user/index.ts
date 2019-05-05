import { AuthenticationError } from 'apollo-server'
import { filter, isNil, compose, not } from 'ramda'
import { IResolvers, IResolverObject, IFieldResolver } from 'graphql-tools'
import { User } from '../../models'

export const root: IResolvers = {
  User: {
    id: root => root._id.toString(),
  },
}

export const queries: IResolverObject = {
  me: async (_, __, { user }) => {
    if (!user) {
      return null
    }

    const dbUser = await User.findById(user._id).exec()

    return dbUser
  },
  user: (root, args, ctx, info) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (queries.me as IFieldResolver<any, any, any>)(root, args, ctx, info)
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
