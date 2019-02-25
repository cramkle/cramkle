import { AuthenticationError } from 'apollo-server'
import { filter, identity } from 'ramda'
import { User } from '../../models'

export const root = {
  User: {
    id: root => root._id.toString(),
  },
}

export const queries = {
  user: async (_, __, { user }) => {
    if (!user) {
      return null
    }

    const dbUser = await User.findById(user._id).lean()

    return dbUser
  },
}

export const mutations = {
  updateProfile: async (
    _,
    { email, username, password, confirmPassword },
    { user }
  ) => {
    if (!(await User.comparePassword(confirmPassword, user.password))) {
      throw new AuthenticationError('User not authenticated')
    }

    const updateProps = filter(identity, { email, username, password })

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

    await User.hashifyAndSave(user)

    return user
  },
}
