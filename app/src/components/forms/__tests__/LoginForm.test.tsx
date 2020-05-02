import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import LoginForm from '../LoginForm'

const render = () => {
  const i18n = setupI18n()

  i18n.activate('en')

  const utils = rtlRender(
    <MemoryRouter>
      <I18nProvider i18n={i18n}>
        <LoginForm />
      </I18nProvider>
    </MemoryRouter>
  )

  return utils
}

describe('<LoginForm />', () => {
  it('should show error message on failure', async () => {
    global.fetch.mockResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    })

    const { getByLabelText, getByText, getByTestId } = render()

    const usernameInput = getByLabelText(/username/i)
    const passwordInput = getByLabelText(/password/i)

    const submitButton = getByTestId('submit-btn')

    await waitFor(() => expect(submitButton).toBeDisabled())

    fireEvent.change(usernameInput, { target: { value: 'lucas' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    await waitFor(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(
        getByText(/invalid username and\/or password/i)
      ).toBeInTheDocument()
    )
  })
})
