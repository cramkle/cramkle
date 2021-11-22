import { Trans } from '@lingui/macro'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import * as React from 'react'
import { graphql, usePreloadedQuery } from 'react-relay'
import { useNavigate } from 'react-router'

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '../components/views/AlertDialog'
import { Button } from '../components/views/Button'
// import { CircularProgress } from '../components/views/CircularProgress'
// import { Container } from '../components/views/Container'
import { Body1, Headline1 } from '../components/views/Typography'
import { RelayDeckCard } from '../relayComponents/RelayDeckCard'
import type { RelayDeckCard_deck$data } from '../relayComponents/__generated__/RelayDeckCard_deck.graphql'
import styles from './StudySection.module.css'
import type { StudySectionQuery } from './__generated__/StudySectionQuery.graphql'

const DECKS_TO_STUDY_QUERY = graphql`
  query StudySectionQuery {
    decks(studyOnly: true) {
      id
      ...RelayDeckCard_deck
    }
  }
`

export const loaderMetadata = () => {
  return { document: DECKS_TO_STUDY_QUERY, variables: {} }
}

interface Props {
  preloadedData: any
}

const StudySection: React.FC<Props> = (props) => {
  const { preloadedData } = props
  const navigate = useNavigate()
  const data = usePreloadedQuery<StudySectionQuery>(
    DECKS_TO_STUDY_QUERY,
    preloadedData
  )

  const [selectedDeck, setSelectedDeck] =
    useState<RelayDeckCard_deck$data | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDeckSelect = (deck: RelayDeckCard_deck$data) => {
    setSelectedDeck(deck)
  }

  const handleStudyDeck = () => {
    navigate(`/study/${selectedDeck!.slug}`)
  }

  /*
  if (error || networkStatus === NetworkStatus.refetch) {
    return (
      <Container className="mt-0 md:mt-8 flex flex-col justify-center items-center text-center py-4">
        <Body1 className="text-txt text-opacity-text-primary">
          <Trans>
            An error has occurred when trying to get your decks to study.
          </Trans>
        </Body1>
        <Body2 className="text-txt text-opacity-text-secondary mt-2">
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
  */

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
            <Button
              ref={cancelRef}
              onClick={() => setSelectedDeck(null)}
              variation="secondary"
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button className="ml-2" onClick={handleStudyDeck}>
              <Trans>Start Session</Trans>
            </Button>
          </div>
        </AlertDialog>
      )}
      <Headline1 className="mt-6 text-txt text-opacity-text-primary">
        <Trans>Study today</Trans>
      </Headline1>
      {decks.length > 0 ? (
        <div className="mt-6 mb-4">
          <div className={classNames(styles.grid, 'grid gap-4')}>
            {decks.map((deck) => (
              <RelayDeckCard
                key={deck.id}
                deck={deck}
                onClick={handleDeckSelect}
                showStudySessionDetails
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex">
          <Body1 className="text-base text-txt text-opacity-text-primary">
            <Trans>You've finished studying your decks for now.</Trans>
          </Body1>
        </div>
      )}
    </>
  )
}

export default StudySection
