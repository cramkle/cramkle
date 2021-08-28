import type { ApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client/cache'

import type { UserQuery } from '../components/__generated__/UserQuery'
import userQuery from '../components/userQuery.gql'

export async function getUserPreferences(
  client: ApolloClient<NormalizedCacheObject>,
  request: Request
) {
  const cramkleLanguage = request.headers.get('x-cramkle-lang')!

  try {
    const {
      data: { me: user },
    } = await client.query<UserQuery>({ query: userQuery })

    if (user && user.preferences.locale == null) {
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
          locale: cramkleLanguage ?? 'en',
        },
      })
    }

    const language = user?.preferences.locale ?? cramkleLanguage

    return { language, darkMode: user?.preferences.darkMode }
  } catch {
    return { language: cramkleLanguage, darkMode: false }
  }
}
