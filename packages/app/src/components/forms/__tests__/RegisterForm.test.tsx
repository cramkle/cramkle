import { MockedProvider } from '@apollo/react-testing'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render as rtlRender } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import React from 'react'

import RegisterForm from 'components/RegisterForm'

const render = (ui: React.ReactElement<any>) => {
  const i18n = setupI18n()

  i18n.activate('en')

  const utils = rtlRender(
    <MemoryRouter>
      <I18nProvider i18n={i18n}>
        <MockedProvider>{ui}</MockedProvider>
      </I18nProvider>
    </MemoryRouter>
  )

  return utils
}

describe('<RegisterForm />', () => {
  function flushPromises() {
    return new Promise(resolve => setImmediate(resolve))
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should be initially disabled', () => {
    const { getByTestId } = render(<RegisterForm />)

    const submitButton = getByTestId('register-submit-btn')

    expect(submitButton).toBeDisabled()
  })

  it('should be enabled with filled fields', async () => {
    const { getByLabelText, getByTestId } = render(<RegisterForm />)

    const submitButton = getByTestId('register-submit-btn')

    const usernameInput = getByLabelText(/username/i)
    const emailInput = getByLabelText(/e-?mail/i)
    const passwordInput = getByLabelText(/password/i)
    const agreementCheckbox = getByLabelText(/i agree/i)

    fireEvent.change(usernameInput, { target: { value: 'user' } })
    fireEvent.change(emailInput, { target: { value: 'user@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'hunter2' } })
    fireEvent.click(agreementCheckbox)

    await flushPromises()
    jest.runAllTimers()

    expect(submitButton).toBeEnabled()
  })

  it('should be disabled without terms agreement', () => {
    const { getByLabelText, getByTestId } = render(<RegisterForm />)

    const submitButton = getByTestId('register-submit-btn')

    const usernameInput = getByLabelText(/username/i)
    const emailInput = getByLabelText(/e-?mail/i)
    const passwordInput = getByLabelText(/password/i)

    fireEvent.change(usernameInput, { target: { value: 'user' } })
    fireEvent.change(emailInput, { target: { value: 'user@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'hunter2' } })

    expect(submitButton).toBeDisabled()
  })
})
