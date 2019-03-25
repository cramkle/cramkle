import { Application } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import createStore from 'connect-redis'

import { User } from '../models'

const RedisStore = createStore(session)

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
    let cookieOpts = {
      httpOnly: true,
      secure: false,
    }

    if (process.env.NODE_ENV === 'production') {
      app.set('trust proxy', 1)
      cookieOpts.secure = true
    }

    app.use(
      session({
        name: 'sessid',
        store: new RedisStore({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
        }),
        cookie: cookieOpts,
        secret: process.env.SESSION_SECRET || '__development__',
        resave: false,
        saveUninitialized: true,
      })
    )
    app.use(passport.initialize())
    app.use(passport.session())
  },
}
