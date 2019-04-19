import React from 'react'
import { render, fireEvent, wait } from 'react-testing-library'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'

import createDeckMutation from '../../../graphql/createDeckMutation.gql'
import AddDeckForm from '../AddDeckForm'

describe('<AddDeckForm />', () => {
  it('should add deck on click', async () => {
    const mutationMocks: MockedResponse[] = [
      {
        request: {
          query: createDeckMutation,
          variables: {
            title: 'my title',
          },
        },
        result: {
          data: {
            createDeck: {
              id: 'id',
              slug: 'id',
              title: 'my title',
            },
          },
        },
      },
    ]

    const closeCallback = jest.fn()

    const wrapper = render(
      <MockedProvider mocks={mutationMocks}>
        <AddDeckForm open onClose={closeCallback} />
      </MockedProvider>
    )

    const titleInput = wrapper.getByLabelText(/title/i)
    const submitButton = wrapper.getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: 'my title' } })

    fireEvent.click(submitButton)

    await wait(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })
})
