import { User } from '../models'

declare global {
  interface Context {
    user: User
  }
}
