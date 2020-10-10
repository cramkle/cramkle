import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface ThemeValue {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

const ctx = React.createContext<ThemeValue | undefined>(undefined)

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined' ? 'light' : window.__theme
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
