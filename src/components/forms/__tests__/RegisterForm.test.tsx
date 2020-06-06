import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { render } from '../../../test/utils'
import RegisterForm from '../RegisterForm'

describe('<RegisterForm />', () => {
  it('should be initially disabled', async () => {
    const { getByTestId } = render(<RegisterForm />)

    const submitButton = getByTestId('register-submit-btn')

    await waitFor(() => expect(submitButton).toBeDisabled())
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

    await waitFor(() => expect(submitButton).toBeEnabled())
  })

  it('should be disabled without terms agreement', async () => {
    const { getByLabelText, getByTestId } = render(<RegisterForm />)

    const submitButton = getByTestId('register-submit-btn')

    const usernameInput = getByLabelText(/username/i)
    const emailInput = getByLabelText(/e-?mail/i)
    const passwordInput = getByLabelText(/password/i)

    fireEvent.change(usernameInput, { target: { value: 'user' } })
    fireEvent.change(emailInput, { target: { value: 'user@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'hunter2' } })

    await waitFor(() => expect(submitButton).toBeDisabled())
  })
})
