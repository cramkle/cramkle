import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import React from 'react'
import { render as rtlRender, fireEvent, wait } from 'react-testing-library'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'

import AddDeckForm, { CREATE_DECK_MUTATION } from '../AddDeckForm'

interface Options {
  mutationMocks?: MockedResponse[]
}

const render = (ui: React.ReactElement, options: Options = {}) => {
  const deckMock = {
    id: 'id',
    slug: 'id',
    title: 'my title',
  }

  const {
    mutationMocks = [
      {
        request: {
          query: CREATE_DECK_MUTATION,
          variables: {
            title: deckMock.title,
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
    <I18nProvider i18n={i18n}>
      <MockedProvider mocks={mutationMocks}>{ui}</MockedProvider>
    </I18nProvider>
  )

  return {
    ...utils,
    deckMock,
  }
}

describe('<AddDeckForm />', () => {
  it('should add deck on submit click', async () => {
    const closeCallback = jest.fn()
    const { getByLabelText, getByText, deckMock } = render(
      <AddDeckForm open onClose={closeCallback} />
    )

    const titleInput = getByLabelText(/title/i)
    const submitButton = getByText(/create/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })
    fireEvent.click(submitButton)

    await wait(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })

  it.skip('should add one deck on input enter', async () => {
    const closeCallback = jest.fn()
    const { getByLabelText, deckMock } = render(
      <AddDeckForm open onClose={closeCallback} />
    )

    const titleInput = getByLabelText(/title/i)

    fireEvent.input(titleInput, { target: { value: deckMock.title } })
    fireEvent.keyPress(titleInput, { key: 'Enter', code: 13 })

    await wait(() => expect(closeCallback).toHaveBeenCalledTimes(1))
  })
})
