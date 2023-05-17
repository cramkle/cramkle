import 'fontsource-libre-franklin/latin.css'
import '@src/styles/material.scss'
import '@src/styles/tailwind.scss'
import './layout.scss'

import classNames from 'classnames'
import { headers } from 'next/headers'
import { Suspense } from 'react'

import { ApolloProvider } from '@src/components/ApolloProvider'
import CramkleToasts from '@src/components/CramkleToasts'
import { HintsProvider } from '@src/components/HintsContext'
import { I18nProvider } from '@src/components/I18nProvider'
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

  const cramkleLang = headers().get('x-cramkle-lang') ?? 'en'

  const { language, darkMode } = await getUserPreferences(
    apolloClient,
    user,
    cramkleLang
  )

  return (
    <html
      className={classNames('h-full', {
        '__dark-mode': darkMode,
        '__light-mode': !darkMode,
      })}
      lang={language}
    >
      <head></head>
      <body className="h-full">
        <UserContext user={user ?? undefined}>
          <I18nProvider lang={language}>
            <ApolloProvider>
              <HintsProvider userAgent={headers().get('user-agent')}>
                <ThemeProvider userPreferredTheme={darkMode ? 'dark' : 'light'}>
                  <Suspense
                    fallback={
                      <div
                        className="h-full w-full flex items-center justify-center bg-background bg-opacity-background"
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
          </I18nProvider>
        </UserContext>
      </body>
    </html>
  )
}
