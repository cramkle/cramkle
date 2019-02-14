const passport = require('passport')
const { Strategy } = require('passport-local')
const session = require('express-session')

const { User } = require('../models')

passport.use(new Strategy(
  async (username, password, done) => {
    let user = null

    try {
      user = await User.findOne({ username }).exec()
    } catch (e) {
      done(e)
      return
    }

    if (!user) {
      done(null, false, { message: 'Incorrect username' })
      return
    }

    if (!await user.comparePassword(password, user.password)) {
      done(null, false, { message: 'Incorrect password' })
      return
    }

    return done(null, user)
  }
))

module.exports = {
  set: app => {
    app.use(session())
    app.use(passport.initialize())
    app.use(passport.session())
  },
}
