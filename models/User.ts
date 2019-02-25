import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

interface UserDocument extends Document {
  hashifyAndSave(): Promise<void>
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<UserDocument>({
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

UserSchema.methods.hashifyAndSave = function() {
  const user = this

  return new Promise((res, rej) => {
    bcrypt.hash(user.password, 12, (err, hash) => {
      if (err) {
        console.error(err) // eslint-disable-line no-console
        rej(err)
        return
      }

      user.password = hash
      user.save().then(res)
    })
  })
}

UserSchema.methods.comparePassword = function(candidate) {
  const user = this

  return new Promise((res, rej) => {
    bcrypt.compare(candidate, user.password, (err, isMatch) => {
      if (err) {
        console.error(err) // eslint-disable-line no-console
        return rej(err)
      }

      res(isMatch)
    })
  })
}

export default model<UserDocument>('user', UserSchema)
