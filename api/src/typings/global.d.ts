import { User } from '../models'

declare global {
  interface Context {
    user?: User
  }

  namespace Express {
    interface User extends UserDocument {
      _id: string
      username: string
    }
  }
}
