const { AuthenticationError } = require('apollo-server')
const { filter, identity } = require('ramda')
const { User } = require('../../models')

module.exports = {
  root: {
    User: {
      id: root => root._id.toString(),
    },
  },
  queries: {
    user: async (_, __, { req: { user } }) => {
      const dbUser = await User.findById(user._id).lean()

      return dbUser
    },
  },
  mutations: {
    updateProfile: async (
      _,
      { email, username, password, confirmPassword },
      { req: { user } }
    ) => {
      if (!(await User.comparePassword(confirmPassword, user.password))) {
        throw new AuthenticationError()
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
  },
}
