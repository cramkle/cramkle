import type { MockedResponse } from '@apollo/react-testing'
import { MockedProvider } from '@apollo/react-testing'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, fireEvent, render as rtlRender } from '@testing-library/react'
import type { MemoryHistory, Update } from 'history'
import { createMemoryHistory } from 'history'
import { en as enPlural } from 'make-plural/plurals'
import type { FC, ReactElement } from 'react'
import { useLayoutEffect, useReducer, useRef } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Router } from 'react-router'

import { messages as enCatalog } from '../locales/en/messages'

interface RenderOptions {
  mocks?: MockedResponse[]
  history?: MemoryHistory
}

export function render(ui: ReactElement, options?: RenderOptions) {
  const i18n = setupI18n()

  i18n.load('en', enCatalog)
  i18n.loadLocaleData({ en: { plurals: enPlural } })

  i18n.activate('en')

  const BrowserRouter: FC<{ history?: MemoryHistory }> = ({
    children,
    history: historyProps,
  }) => {
    const historyRef = useRef<MemoryHistory>()
    if (historyRef.current == null) {
      historyRef.current = historyProps ?? createMemoryHistory()
    }

    const history = historyRef.current

    const [state, dispatch] = useReducer(
      (_: Update, action: Update) => action,
      {
        action: history.action,
        location: history.location,
      }
    )

    useLayoutEffect(() => history.listen(dispatch), [history])

    return (
      <Router
        action={state.action}
        location={state.location}
        navigator={history}
      >
        {children}
      </Router>
    )
  }

  const history = options?.history

  const utils = rtlRender(
    <BrowserRouter {...(history ? { history } : undefined)}>
      <HelmetProvider>
        <I18nProvider i18n={i18n}>
          <MockedProvider
            {...(options?.mocks ? { mocks: options.mocks } : undefined)}
            addTypename={false}
          >
            {ui}
          </MockedProvider>
        </I18nProvider>
      </HelmetProvider>
    </BrowserRouter>
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
