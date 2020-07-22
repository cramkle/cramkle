import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { NetworkStatus } from 'apollo-client'
import gql from 'graphql-tag'
import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import DeckCard, { deckCardFragment } from '../DeckCard'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '../views/AlertDialog'
import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import { Body1, Body2 } from '../views/Typography'
import { DecksToStudy } from './__generated__/DecksToStudy'

const DECKS_TO_STUDY_QUERY = gql`
  query DecksToStudy {
    decks(studyOnly: true) {
      id
      ...DeckCard_deck
    }
  }

  ${deckCardFragment}
`

const StudySection: React.FunctionComponent = () => {
  const history = useHistory()
  const { data, loading, error, refetch, networkStatus } = useQuery<
    DecksToStudy
  >(DECKS_TO_STUDY_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  const [selectedDeck, setSelectedDeck] = useState(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useTopBarLoading(loading)

  const handleDeckSelect = (deck: { id: string }) => {
    setSelectedDeck(data.decks.find(({ id }) => deck.id === id))
  }

  const handleStudyDeck = () => {
    history.push(`/study/${selectedDeck.slug}`)
  }

  if (loading && networkStatus !== NetworkStatus.refetch) {
    return null
  }

  if (error || networkStatus === NetworkStatus.refetch) {
    return (
      <Container className="mt-0 md:mt-8 flex flex-col justify-center items-center text-center">
        <Body1 className="text-primary">
          <Trans>
            An error has ocurred when trying to get your decks to study.
          </Trans>
        </Body1>
        <Body2 className="text-secondary mt-2">
          <Trans>Check your internet connection and try again.</Trans>
        </Body2>

        <Button
          className="mt-4"
          variation="primary"
          disabled={loading}
          onClick={() => refetch()}
        >
          {loading ? (
            <CircularProgress className="align-middle" size={16} />
          ) : (
            <Trans>Try again</Trans>
          )}
        </Button>
      </Container>
    )
  }

  const { decks } = data

  return (
    <>
      {selectedDeck !== null && (
        <AlertDialog
          isOpen
          onDismiss={() => setSelectedDeck(null)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogLabel>
            <Trans>Study deck</Trans>
          </AlertDialogLabel>
          <AlertDialogDescription>
            <Trans>
              Do you want to start a study session of the deck{' '}
              {selectedDeck.title}?
            </Trans>
          </AlertDialogDescription>
          <div className="flex justify-end">
            <Button ref={cancelRef} onClick={() => setSelectedDeck(null)}>
              <Trans>Cancel</Trans>
            </Button>
            <Button className="ml-2" onClick={handleStudyDeck}>
              <Trans>Start Session</Trans>
            </Button>
          </div>
        </AlertDialog>
      )}
      {decks.length > 0 ? (
        <div className="py-4">
          <div className="grid grid-cols-12 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="col-span-12 sm:col-span-6 xl:col-span-4"
              >
                <DeckCard
                  deck={deck}
                  onClick={handleDeckSelect}
                  showStudySessionDetails
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <Body1 className="text-base">
            <Trans>You've finished studying your decks for now.</Trans>
          </Body1>
        </div>
      )}
    </>
  )
}

export default StudySection
