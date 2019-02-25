import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

interface UserDocument extends Document {
}

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'E-mail is required'],
  },
})

const User = model<UserDocument>('user', UserSchema)

User.hashifyAndSave = user => {
  return new Promise((res, rej) => {
    bcrypt.hash(user.password, 12, (err, hash) => {
      if (err) {
        console.error(err) // eslint-disable-line no-console
        return rej(err)
      }

      user.password = hash
      user.save().then(res)
    })
  })
}

User.comparePassword = (candidate, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(candidate, hash, (err, isMatch) => {
      if (err) {
        console.error(err) // eslint-disable-line no-console
        return rej(err)
      }

      res(isMatch)
    })
  })
}

export default User
