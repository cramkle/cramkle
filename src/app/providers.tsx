'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import type { Messages } from '@lingui/core'
import type { ReactElement } from 'react'

import { ApolloProvider } from '@src/components/ApolloProvider'
import { HintsProvider } from '@src/components/HintsContext'
import { LinguiProvider } from '@src/components/LinguiProvider'
import { ThemeProvider } from '@src/components/Theme'
import { UserContext } from '@src/components/UserContext'
import type { UserQuery_me } from '@src/components/__generated__/UserQuery'

export function Providers({
  children,
  language,
  darkMode,
  user,
  messages,
  userAgent,
}: {
  children: ReactElement
  language: string
  darkMode: boolean
  user: UserQuery_me | null
  messages: Messages
  userAgent: string | null
}) {
  return (
    <LinguiProvider lang={language} messages={messages}>
      <UserContext user={user ?? undefined}>
        <ApolloProvider>
          <HintsProvider userAgent={userAgent}>
            <ThemeProvider userPreferredTheme={darkMode ? 'dark' : 'light'}>
              <CacheProvider>
                <ChakraProvider>{children}</ChakraProvider>
              </CacheProvider>
            </ThemeProvider>
          </HintsProvider>
        </ApolloProvider>
      </UserContext>
    </LinguiProvider>
  )
}
