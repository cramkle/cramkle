import 'fontsource-libre-franklin/latin.css'
import './layout.scss'
import '@src/styles/tailwind.scss'

import classNames from 'classnames'
import { cookies, headers } from 'next/headers'
import { Suspense } from 'react'

import CramkleToasts from '@src/components/CramkleToasts'
import type { UserQuery } from '@src/components/__generated__/UserQuery'
import userQuery from '@src/components/userQuery.gql'
import { getServerApolloClient } from '@src/utils/serverApolloClient'
import { getUserPreferences } from '@src/utils/userPreferences'

import { Providers } from './providers'

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
        <Providers
          language={language}
          darkMode={darkMode}
          user={user}
          messages={messages}
          userAgent={headers().get('user-agent')}
        >
          <Suspense
            fallback={
              <div
                className="h-full w-full flex items-center justify-center"
                aria-busy="true"
              >
                <p className="text-txt text-opacity-text-primary">Loading...</p>
              </div>
            }
          >
            <CramkleToasts />
            <div className="h-full">{children}</div>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
