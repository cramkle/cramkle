import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'

import createDeckMutation from '../../../graphql/createDeckMutation.gql'
import AddDeckForm from '../AddDeckForm'

describe('<AddDeckForm />', () => {
  afterEach(() => {
    cleanup()
  })

  it('should add deck on click', () => {
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

    const wrapper = render(
      <MockedProvider mocks={mutationMocks}>
        <AddDeckForm open onClose={jest.fn()} />
      </MockedProvider>
    )

    const titleInput = wrapper.getByLabelText('Title')

    fireEvent.input(titleInput, { target: { value: 'my title' } })

    const submitButton = wrapper.getByText(/Create/i)

    fireEvent.click(submitButton)
  })
})
