import { UserModel } from '../models'

declare global {
  interface Context {
    user?: UserModel
  }

  namespace Express {
    interface User extends UserDocument {
      _id: string
      username: string
    }
  }
}
