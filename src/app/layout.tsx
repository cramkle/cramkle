import { headers } from 'next/headers'
import { Suspense } from 'react'

import { ApolloProvider } from '../components/ApolloProvider'
import CramkleToasts from '../components/CramkleToasts'
import { HintsProvider } from '../components/HintsContext'
import { I18nProvider } from '../components/I18nProvider'
import { ThemeProvider } from '../components/Theme'
import { UserContext } from '../components/UserContext'
import type { UserQuery } from '../components/__generated__/UserQuery'
import userQuery from '../components/userQuery.gql'
import { createApolloClient } from '../utils/apolloClient'
import { getUserPreferences } from '../utils/userPreferences'

import 'fontsource-libre-franklin/latin.css'
import '../material.scss'
import '../app.scss'
import '../tailwind.scss'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()

  const apiHost = process.env.API_HOST ?? 'http://localhost:5000'

  const apolloClient = createApolloClient(
    `${apiHost}/api/graphql`,
    headersList.get('cookie')
  )

  const cramkleLang = headersList.get('x-cramkle-lang') ?? 'en'

  const {
    data: { me: user },
  } = await apolloClient.query<UserQuery>({ query: userQuery })

  const { language, darkMode } = await getUserPreferences(
    apolloClient,
    user,
    cramkleLang
  )

  return (
    <html lang={language}>
      <head />
      <body>
        <UserContext user={user ?? undefined}>
          <I18nProvider lang={language}>
            <ApolloProvider>
              <HintsProvider userAgent={headersList.get('user-agent')}>
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
                    <div>{children}</div>
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
