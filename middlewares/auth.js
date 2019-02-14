const passport = require('passport')
const { Strategy } = require('passport-local')
const session = require('express-session')

const { User } = require('../models')

passport.use(new Strategy(
  async (username, password, done) => {
    let user = null

    try {
      user = await User.findOne({ username }).lean().exec()
    } catch (e) {
      done(e)
      return
    }

    if (!user) {
      done(null, false, { message: 'Incorrect username' })
      return
    }

    if (!await User.comparePassword(password, user.password)) {
      done(null, false, { message: 'Incorrect password' })
      return
    }

    return done(null, user)
  }
))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  let user = null

  try {
    user = await User.findOne({ _id: id }).lean().exec()
  } catch (e) {
    done(e)
    return
  }

  done(null, user)
})

module.exports = {
  set: app => {
    app.use(session({
      secret: 'hello world',
      resave: false,
      saveUninitialized: true,
    }))
    app.use(passport.initialize())
    app.use(passport.session())
  },
}
