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
    user: async (_, { id }) => {
      const user = await User.findById(id)

      return user
    },
  },
  mutations: {
    updateProfile: async (
      _,
      { id, email, username, password, confirmPassword }
    ) => {
      // TODO: retrieve id from logged user
      const user = await User.findById(id)

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
