import { MockedProvider, MockedResponse } from '@apollo/react-testing'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render as rtlRender, wait } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import AddDeckForm, { CREATE_DECK_MUTATION } from '../AddDeckForm'

interface Options {
  mutationMocks?: MockedResponse[]
}

const render = (ui: React.ReactElement, options: Options = {}) => {
  const deckMock = {
    id: 'id',
    slug: 'id',
    title: 'my title',
    description: '',
  }

  const {
    mutationMocks = [
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
            createDeck: deckMock,
          },
        },
      },
    ],
  } = options

  const i18n = setupI18n()

  i18n.activate('en')

  const utils = rtlRender(
    <MemoryRouter>
      <I18nProvider i18n={i18n}>
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          {ui}
        </MockedProvider>
      </I18nProvider>
    </MemoryRouter>
  )

  return {
    ...utils,
    deckMock,
  }
}

describe('<AddDeckForm />', () => {
  beforeEach(() => {
    //jest.useFakeTimers()
  })

  it('should add deck on submit click', () => {
    const closeCallback = jest.fn()
    const { getByLabelText, getByText, deckMock } = render(
      <AddDeckForm open onClose={closeCallback} />
    )

    const titleInput = getByLabelText(/title/i)
    const submitButton = getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })

    wait(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    wait(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })

  it('should add one deck on input enter', () => {
    const closeCallback = jest.fn()
    const { getByLabelText, getByText, deckMock } = render(
      <AddDeckForm open onClose={closeCallback} />
    )

    const titleInput = getByLabelText(/title/i)
    const submitButton = getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })

    wait(() => expect(submitButton).toBeEnabled())

    fireEvent.keyPress(titleInput, { key: 'Enter', code: 13 })

    wait(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })
})
