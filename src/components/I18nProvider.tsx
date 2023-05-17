'use client'

import { i18n } from '@lingui/core'
import { I18nProvider as Provider } from '@lingui/react'
import { useEffect } from 'react'

import { messages as enMessages } from '../locales/en/messages'

if (typeof window !== 'undefined') {
  i18n.load('en', enMessages as any)
  i18n.activate('en')
}

export const I18nProvider = ({
  children,
  lang = 'en',
}: {
  children: React.ReactNode
  lang: string
}) => {
  useEffect(() => {
    i18n.activate(lang)
  }, [lang])

  return <Provider i18n={i18n}>{children}</Provider>
}
