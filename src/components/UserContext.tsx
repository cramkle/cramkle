import type { FC } from 'react'
import { createContext, useContext } from 'react'

import type { UserQuery_me } from './__generated__/UserQuery'

const ctx = createContext<UserQuery_me | undefined>(undefined)

export const useCurrentUser = () => {
  const user = useContext(ctx)

  if (user == undefined) {
    throw new Error(
      'No user found in context, are you inside a logged in route?'
    )
  }

  return user
}

export const UserContext: FC<{ user?: UserQuery_me | undefined }> = ({
  user,
  children,
}) => {
  return <ctx.Provider value={user}>{children}</ctx.Provider>
}
