import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { Cell, Grid, Row } from '@material/react-layout-grid'
import DeckCard from 'components/DeckCard'
import Button from 'components/views/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'components/views/Dialog'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useHistory } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
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
        <Dialog open onClose={() => setSelectedDeck(null)}>
          <DialogTitle>
            <Trans>Study deck</Trans>
          </DialogTitle>
          <DialogContent>
            <Trans>
              Do you want to start a study session of the deck{' '}
              {selectedDeck.title}?
            </Trans>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDeck(null)}>
              <Trans>Cancel</Trans>
            </Button>
            <Button onClick={handleStudyDeck}>
              <Trans>Start Session</Trans>
            </Button>
          </DialogActions>
        </Dialog>
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
