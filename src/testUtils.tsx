import { MockedProvider, MockedResponse } from '@apollo/react-testing'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render as rtlRender } from '@testing-library/react'
import { en as enPlural } from 'make-plural/plurals'
import React, { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

import enCatalog from './locales/en/messages'

interface RenderOptions {
  mocks?: MockedResponse[]
}

export function render(ui: ReactElement, options?: RenderOptions) {
  const i18n = setupI18n()

  i18n.load('en', enCatalog.messages)
  i18n.loadLocaleData({ en: { plurals: enPlural } })

  i18n.activate('en')

  const utils = rtlRender(
    <MemoryRouter>
      <I18nProvider i18n={i18n}>
        <MockedProvider mocks={options?.mocks} addTypename={false}>
          {ui}
        </MockedProvider>
      </I18nProvider>
    </MemoryRouter>
  )

  return utils
}
