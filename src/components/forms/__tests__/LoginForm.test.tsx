import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { render } from '../../../test/utils'
import LoginForm from '../LoginForm'

describe('<LoginForm />', () => {
  it('should show error message on failure', async () => {
    global.fetch.mockResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    })

    const { getByLabelText, getByText, getByTestId } = render(<LoginForm />)

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
