import { Application } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import session from 'express-session'

import { User } from '../models'

passport.use(
  new Strategy(async (username: string, password: string, done) => {
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

    if (!(await user.comparePassword(password))) {
      done(null, false, { message: 'Incorrect password' })
      return
    }

    return done(null, user)
  })
)

// FIXME: why can't it find the name 'User'?
passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  let user = null

  try {
    user = await User.findOne({ _id: id })
      .lean()
      .exec()
  } catch (e) {
    done(e)
    return
  }

  done(null, user)
})

export default {
  set: (app: Application) => {
    app.use(
      session({
        // TODO: use an actual secret value
        secret: 'hello world',
        resave: false,
        saveUninitialized: true,
      })
    )
    app.use(passport.initialize())
    app.use(passport.session())
  },
}
