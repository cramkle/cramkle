import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { Cell, Grid, Row } from '@material/react-layout-grid'
import gql from 'graphql-tag'
import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import DeckCard from '../DeckCard'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '../views/AlertDialog'
import Button from '../views/Button'
import { DecksToStudy } from './__generated__/DecksToStudy'

const DECKS_TO_STUDY_QUERY = gql`
  query DecksToStudy {
    decks {
      id
      title
      slug
      description
    }
  }
`

const StudySection: React.FunctionComponent = () => {
  const history = useHistory()
  const { data, loading } = useQuery<DecksToStudy>(DECKS_TO_STUDY_QUERY)
  const [selectedDeck, setSelectedDeck] = useState(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useTopBarLoading(loading)

  const handleDeckSelect = (deck: { id: string }) => {
    setSelectedDeck(data.decks.find(({ id }) => deck.id === id))
  }

  const handleStudyDeck = () => {
    history.push(`/study/${selectedDeck.slug}`)
  }

  if (loading) {
    return null
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
            <Button className="ml2" onClick={handleStudyDeck}>
              <Trans>Start Session</Trans>
            </Button>
          </div>
        </AlertDialog>
      )}
      <Grid className="w-100">
        <Row>
          {decks.map((deck) => (
            <Cell key={deck.id}>
              <DeckCard deck={deck} onClick={handleDeckSelect} />
            </Cell>
          ))}
        </Row>
      </Grid>
    </>
  )
}

export default StudySection
