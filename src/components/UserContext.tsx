import type { FC } from 'react'
import { createContext, useContext } from 'react'

import type { UserQuery_me } from './__generated__/UserQuery'

const ctx = createContext<UserQuery_me | undefined>(undefined)

export const useCurrentUser = () => {
  const user = useContext(ctx)

  if (user == undefined) {
    throw new Error('Hook useCurrentUser must be used inside <UserContext>')
  }

  return user
}

export const UserContext: FC<{ user: UserQuery_me }> = ({ user, children }) => {
  return <ctx.Provider value={user}>{children}</ctx.Provider>
}
