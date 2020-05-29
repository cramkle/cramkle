import { createHmac } from 'crypto'

import { UserDocument } from '../../mongo/User'

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

export const createHashWithTimestamp = (
  timestamp: number,
  user: UserDocument
) => {
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
