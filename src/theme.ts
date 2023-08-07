import type { ThemeConfig } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

export default function createChakraTheme({ darkMode }: { darkMode: boolean }) {
  const config: ThemeConfig = {
    initialColorMode: darkMode ? 'dark' : 'light',
    useSystemColorMode: false,
  }

  const theme = extendTheme({
    config,
  })

  return theme
}
