'use client'

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as React from 'react'

declare global {
  type Theme = 'dark' | 'light'

  interface Window {
    __theme: Theme
    __onThemeChange: (newTheme: Theme) => void
    __setPreferredTheme: (theme: Theme) => void
  }
}

interface ThemeValue {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

const ctx = React.createContext<ThemeValue | undefined>(undefined)

export const ThemeProvider: React.FC<{ userPreferredTheme: Theme }> = ({
  userPreferredTheme,
  children,
}) => {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined'
      ? userPreferredTheme
      : window.__theme ?? 'light'
  )

  useEffect(() => {
    window.__onThemeChange = (newTheme: Theme) => {
      setTheme(newTheme)
    }
  }, [])

  const updateTheme = useCallback((newTheme: Theme) => {
    window.__setPreferredTheme(newTheme)
  }, [])

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
