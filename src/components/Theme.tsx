'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useContext, useMemo, useState } from 'react'
import * as React from 'react'

declare global {
  type Theme = 'dark' | 'light'
}

interface ThemeValue {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

const ctx = React.createContext<ThemeValue | undefined>(undefined)

export const ThemeProvider = ({
  userPreferredTheme,
  children,
}: {
  userPreferredTheme: Theme
  children: React.ReactNode
}) => {
  const [theme, setTheme] = useState(() => userPreferredTheme)
  const router = useRouter()

  const updateTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme)
      router.refresh()
    },
    [router]
  )

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme: updateTheme,
    }),
    [theme, updateTheme]
  )

  return <ctx.Provider value={contextValue}>{children}</ctx.Provider>
}

export const useTheme = () => {
  const contextValue = useContext(ctx)

  if (contextValue == null) {
    throw new Error('useTheme must only be used inside <ThemeProvider>')
  }

  return contextValue
}
