import type { ApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client/cache'

import type { UserQuery_me } from '../components/__generated__/UserQuery'

const DEFAULT_LANG = 'en'

export async function getUserPreferences(
  client: ApolloClient<NormalizedCacheObject>,
  user: UserQuery_me | null,
  lang?: string | null
) {
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
          locale: lang ?? DEFAULT_LANG,
        },
      })
    }

    const language = user?.preferences?.locale ?? lang ?? DEFAULT_LANG

    return { language, darkMode: user?.preferences?.darkMode }
  } catch {
    return { language: lang ?? DEFAULT_LANG, darkMode: false }
  }
}
