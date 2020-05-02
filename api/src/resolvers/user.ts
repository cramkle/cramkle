import { createHmac } from 'crypto'

import { AuthenticationError } from 'apollo-server'
import { differenceInHours } from 'date-fns'
import { IResolverObject, IResolvers } from 'graphql-tools'
import { Types } from 'mongoose'

import { UserModel } from '../mongo'
import { UserDocument } from '../mongo/User'
import { globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  User: {
    id: globalIdField(),
  },
}

export const queries: IResolverObject = {
  me: async (_, __, { user }: Context) => {
    if (!user) {
      return null
    }

    const dbUser = await UserModel.findById(user._id).exec()

    return dbUser
  },
}

const createResetPasswordHashValue = ({
  userId,
  email,
  password,
  lastLogin,
  timestamp,
}: {
  userId: string
  email: string
  password: string
  timestamp: number
  lastLogin?: number
}) => {
  return (
    userId +
    email +
    password +
    timestamp.toString() +
    (lastLogin?.toString() ?? '')
  )
}

const createHashWithTimestamp = (timestamp: number, user: UserDocument) => {
  const hashString = createHmac(
    'sha256',
    process.env.RESET_PASSWORD_TOKEN ?? '__development__'
  )
    .update(
      createResetPasswordHashValue({
        userId: user._id.toString(),
        email: user.email,
        password: user.password,
        lastLogin: user.lastLogin?.getTime(),
        timestamp,
      })
    )
    .digest('hex')

  return hashString
}

interface UpdateProfileInput {
  email: string
  username: string
  password: string
  confirmPassword: string
}

interface RequestPasswordResetInput {
  email: string
}

interface ResetPasswordInput {
  token: string
  timestamp: string
  userId: string
  newPassword: string
}

export const mutations: IResolverObject = {
  updateProfile: async (
    _,
    { email, username, password, confirmPassword }: UpdateProfileInput,
    { user }: Context
  ) => {
    if (!(await user?.comparePassword(confirmPassword))) {
      throw new AuthenticationError('User not authenticated')
    }

    const updateProps: Partial<Omit<UpdateProfileInput, 'confirmPassword'>> = {}

    if (email) {
      updateProps.email = email
    }

    if (username) {
      updateProps.username = username
    }

    if (password) {
      updateProps.password = password
    }

    Object.assign(user, updateProps)

    await user?.save()

    return user
  },
  createUser: async (_, { username, email, password }) => {
    const user = new UserModel({ username, email, password })

    const validation = user?.validateSync()

    if (validation) {
      const error = Object.values(validation.errors)[0]
      return Promise.reject(error)
    }

    await user?.hashifyAndSave()

    return user
  },
  requestPasswordReset: async (
    _,
    { input }: { input: RequestPasswordResetInput }
  ) => {
    const user = await UserModel.findOne({ email: input.email })

    if (!user) {
      return { success: false }
    }

    const userId = user._id as Types.ObjectId

    const todayTimestamp = Date.now()

    const hashString = createHashWithTimestamp(todayTimestamp, user)

    // should send email instead
    console.log(`/reset/${userId}/${todayTimestamp.toString(36)}-${hashString}`)

    return { success: true }
  },
  resetPassword: async (_, { input }: { input: ResetPasswordInput }) => {
    const { timestamp, token, userId, newPassword } = input

    const user = await UserModel.findById(userId)

    if (!user) {
      return { success: false }
    }

    const parsedTimestamp = parseInt(timestamp, 36)

    if (token !== createHashWithTimestamp(parsedTimestamp, user)) {
      return { success: false }
    }

    if (differenceInHours(parsedTimestamp, Date.now()) > 24) {
      return { success: false }
    }

    user.password = newPassword
    await user.hashifyAndSave()

    return { success: true }
  },
}
