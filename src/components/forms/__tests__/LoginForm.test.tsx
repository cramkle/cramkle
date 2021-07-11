import { fireEvent, waitFor } from '@testing-library/react'

import { render } from '../../../test/utils'
import LoginForm from '../LoginForm'

describe('<LoginForm />', () => {
  it('should show error message on failure', async () => {
    // @ts-ignore
    global.fetch.mockResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    })

    const { getByLabelText, getByText, getByTestId } = render(<LoginForm />)

    const usernameInput = getByLabelText(/username/i)
    const passwordInput = getByLabelText(/password/i)

    const submitButton = getByTestId('submit-btn')

    fireEvent.change(usernameInput, { target: { value: 'lucas' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(
        getByText(/invalid username and\/or password/i)
      ).toBeInTheDocument()
    )
  })
})
