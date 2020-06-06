import { MockedResponse } from '@apollo/react-testing'
import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { render } from '../../../test/utils'
import AddDeckForm, { CREATE_DECK_MUTATION } from '../AddDeckForm'

const deckMock = {
  __typename: 'Deck',
  id: 'id',
  slug: 'id',
  title: 'my title',
  description: '',
  studySessionDetails: {
    __typename: 'StudySessionDetails',
    newCount: 0,
    learningCount: 0,
    reviewCount: 0,
  },
}

const mocks: MockedResponse[] = [
  {
    request: {
      query: CREATE_DECK_MUTATION,
      variables: {
        title: deckMock.title,
        description: '',
      },
    },
    result: {
      data: {
        createDeck: { deck: deckMock },
      },
    },
  },
]

describe('<AddDeckForm />', () => {
  it('should add deck on submit click', async () => {
    const closeCallback = jest.fn()
    const { getByLabelText, getByText } = render(
      <AddDeckForm open onClose={closeCallback} />,
      { mocks }
    )

    const titleInput = getByLabelText(/title/i)
    const submitButton = getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })

    await waitFor(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    await waitFor(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })

  it('should add one deck on input enter', async () => {
    const closeCallback = jest.fn()
    const { getByLabelText, getByText } = render(
      <AddDeckForm open onClose={closeCallback} />,
      { mocks }
    )

    const titleInput = getByLabelText(/title/i)
    const submitButton = getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    fireEvent.submit(titleInput)

    await waitFor(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })
})
