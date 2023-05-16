import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, fireEvent, render as rtlRender } from '@testing-library/react'
import { en as enPlural } from 'make-plural/plurals'
import type { ReactElement } from 'react'

import { TopbarProvider } from '../hooks/useTopBarLoading'
import { messages as enCatalog } from '../locales/en/messages'

interface RenderOptions {
  mocks?: MockedResponse[]
}

export function render(ui: ReactElement, options?: RenderOptions) {
  const i18n = setupI18n()

  i18n.load('en', enCatalog)
  i18n.loadLocaleData({ en: { plurals: enPlural } })

  i18n.activate('en')

  const utils = rtlRender(
    <I18nProvider i18n={i18n}>
      <MockedProvider
        {...(options?.mocks ? { mocks: options.mocks } : undefined)}
        addTypename={false}
      >
        <TopbarProvider isLoading={false} setLoading={jest.fn()}>
          {ui}
        </TopbarProvider>
      </MockedProvider>
    </I18nProvider>
  )

  return { ...utils, history }
}

export function fireCheckboxClick(element: Document | Node | Element | Window) {
  let resolveRaf = () => {}

  const rafPromise = new Promise<void>((resolve) => {
    resolveRaf = resolve
  })

  const raf = jest.fn().mockImplementation((cb) => rafPromise.then(() => cb()))

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf)

  fireEvent.click(element)

  act(() => {
    resolveRaf()
  })
  ;(window.requestAnimationFrame as any).mockRestore()
}
