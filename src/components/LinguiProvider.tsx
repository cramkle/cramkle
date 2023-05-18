'use client'

import type { Messages } from '@lingui/core'
import { i18n } from '@lingui/core'
import { I18nProvider as Provider } from '@lingui/react'

export const LinguiProvider = ({
  children,
  lang = 'en',
  messages,
}: {
  children: React.ReactNode
  lang: string
  messages: Messages
}) => {
  i18n.loadAndActivate({
    locale: lang,
    messages,
  })

  return <Provider i18n={i18n}>{children}</Provider>
}
