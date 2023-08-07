import type { ApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client/cache'

import type { UserQuery_me } from '../components/__generated__/UserQuery'

const DEFAULT_LANG = 'en'

export async function getUserPreferences(
  client: ApolloClient<NormalizedCacheObject>,
  user: UserQuery_me | null,
  locale?: string
) {
  const fallbackLocale = locale ?? DEFAULT_LANG

  try {
    if (user && user.preferences?.locale == null) {
      await client.mutate({
        mutation: gql`
          mutation UpdateUserLocale($locale: String!) {
            updatePreferences(input: { locale: $locale }) {
              user {
                id
                preferences {
                  locale
                }
              }
            }
          }
        `,
        variables: {
          locale: fallbackLocale,
        },
      })
    }

    const language = user?.preferences?.locale ?? fallbackLocale

    return { language, darkMode: user?.preferences?.darkMode ?? false }
  } catch {
    return { language: fallbackLocale, darkMode: false }
  }
}
