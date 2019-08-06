import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render as rtlRender } from '@testing-library/react'
import React from 'react'

import LoginForm from 'components/LoginForm'

const render = () => {
  const i18n = setupI18n()

  i18n.activate('en')

  const utils = rtlRender(
    <I18nProvider i18n={i18n}>
      <LoginForm />
    </I18nProvider>
  )

  return utils
}

describe('<LoginForm />', () => {
  function flushPromises() {
    return new Promise(resolve => setImmediate(resolve))
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should show error message on failure', async () => {
    global.fetch.mockResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    })

    const { getByLabelText, getByText, getByTestId } = render()

    const usernameInput = getByLabelText(/username/i)
    const passwordInput = getByLabelText(/password/i)

    const submitButton = getByTestId('submit-btn')

    expect(submitButton).toBeDisabled()

    fireEvent.change(usernameInput, { target: { value: 'lucas' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await flushPromises()
    jest.runAllTimers()

    expect(submitButton).toBeEnabled()

    fireEvent.click(submitButton)

    await flushPromises()
    jest.runAllTimers()

    expect(getByText(/invalid username and\/or password/i)).toBeInTheDocument()
  })
})
