import 'fontsource-libre-franklin/latin.css'
import '@src/styles/material.scss'
import './layout.scss'
import '@src/styles/tailwind.scss'

import classNames from 'classnames'
import { cookies, headers } from 'next/headers'
import { Suspense } from 'react'

import { ApolloProvider } from '@src/components/ApolloProvider'
import CramkleToasts from '@src/components/CramkleToasts'
import { HintsProvider } from '@src/components/HintsContext'
import { LinguiProvider } from '@src/components/LinguiProvider'
import { ThemeProvider } from '@src/components/Theme'
import { UserContext } from '@src/components/UserContext'
import type { UserQuery } from '@src/components/__generated__/UserQuery'
import userQuery from '@src/components/userQuery.gql'
import { getServerApolloClient } from '@src/utils/serverApolloClient'
import { getUserPreferences } from '@src/utils/userPreferences'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apolloClient = getServerApolloClient()

  const {
    data: { me: user },
  } = await apolloClient.query<UserQuery>({ query: userQuery })

  const requestCookies = cookies()
  const cookieLocale = requestCookies.get('language')

  const { language, darkMode } = await getUserPreferences(
    apolloClient,
    user,
    cookieLocale?.value
  )

  const { messages } = await import(`../locales/${language}/messages`)

  return (
    <html
      className={classNames('h-full', {
        '__dark-mode': darkMode,
        '__light-mode': !darkMode,
      })}
      lang={language}
    >
      <head />
      <body className="h-full bg-background bg-opacity-background">
        <LinguiProvider lang={language} messages={messages}>
          <UserContext user={user ?? undefined}>
            <ApolloProvider>
              <HintsProvider userAgent={headers().get('user-agent')}>
                <ThemeProvider userPreferredTheme={darkMode ? 'dark' : 'light'}>
                  <Suspense
                    fallback={
                      <div
                        className="h-full w-full flex items-center justify-center"
                        aria-busy="true"
                      >
                        <p className="text-txt text-opacity-text-primary">
                          Loading...
                        </p>
                      </div>
                    }
                  >
                    <CramkleToasts />
                    <div className="h-full">{children}</div>
                  </Suspense>
                </ThemeProvider>
              </HintsProvider>
            </ApolloProvider>
          </UserContext>
        </LinguiProvider>
      </body>
    </html>
  )
}
