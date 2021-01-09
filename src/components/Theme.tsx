import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as React from 'react'

import {
  UpdateDarkMode,
  UpdateDarkModeVariables,
} from './__generated__/UpdateDarkMode'

interface ThemeValue {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

const UPDATE_DARK_MODE_PREFERENCE = gql`
  mutation UpdateDarkMode($darkMode: Boolean!) {
    updatePreferences(input: { darkMode: $darkMode }) {
      user {
        id
        preferences {
          darkMode
        }
      }
    }
  }
`

const ctx = React.createContext<ThemeValue | undefined>(undefined)

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined' ? 'light' : window.__theme ?? 'light'
  )

  const [updatePreferredTheme] = useMutation<
    UpdateDarkMode,
    UpdateDarkModeVariables
  >(UPDATE_DARK_MODE_PREFERENCE)

  useEffect(() => {
    updatePreferredTheme({ variables: { darkMode: theme === 'dark' } })
  }, [updatePreferredTheme, theme])

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
