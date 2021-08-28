import type { FC } from 'react'
import { createContext, useContext, useEffect, useMemo } from 'react'

interface TopbarContext {
  isLoading: boolean
  setLoading: (value: boolean) => void
}

const ctx = createContext<TopbarContext | undefined>(undefined)

export const useTopBarLoading = (loading: boolean) => {
  const ctxValue = useContext(ctx)

  if (typeof ctxValue === 'undefined') {
    throw new Error('useTopBarLoading must be used inside a TopBar context')
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return
    }

    ctxValue.setLoading(loading)
  }, [loading])
}

export const TopbarProvider: FC<TopbarContext> = ({
  isLoading,
  setLoading,
  children,
}) => {
  return (
    <ctx.Provider
      value={useMemo(
        () => ({ isLoading, setLoading }),
        [isLoading, setLoading]
      )}
    >
      {children}
    </ctx.Provider>
  )
}
