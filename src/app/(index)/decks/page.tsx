'use client'

import { gql, useQuery } from '@apollo/client'
import { Plural, Trans } from '@lingui/macro'
import classnames from 'classnames'
import { useCallback, useState } from 'react'
import * as React from 'react'

import DeckCard, { deckCardFragment } from '@src/components/DeckCard'
import AddDeckForm from '@src/components/forms/AddDeckForm'
import { Button } from '@src/components/views/Button'
import { Body1, Headline1 } from '@src/components/views/Typography'

import type { DecksQuery } from './__generated__/DecksQuery'
import styles from './page.module.css'

const DECKS_QUERY = gql`
  query DecksQuery {
    decks {
      id
      ...DeckCard_deck
    }
  }

  ${deckCardFragment}
`

const DecksSection: React.FunctionComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const { loading, data } = useQuery<DecksQuery>(DECKS_QUERY)

  const decks = data?.decks

  if (loading) {
    return (
      <div className="py-4">
        <span className="text-txt text-opacity-text-primary">
          <Trans>Loading decks</Trans>
        </span>
      </div>
    )
  }

  return (
    <>
      <Headline1 className="mt-6 leading-none text-txt text-opacity-text-primary">
        <Trans>Your decks</Trans>
      </Headline1>

      <div className="flex items-center mt-6">
        {decks && decks.length > 0 && (
          <Body1 className="text-txt text-opacity-text-secondary font-medium">
            <Plural
              value={decks.length}
              zero="# decks"
              one="# deck"
              other="# decks"
            />
          </Body1>
        )}
        <Button
          className={classnames({ 'ml-6': decks && decks.length > 0 })}
          onClick={handleDialogOpen}
        >
          <Trans>Create deck</Trans>
        </Button>
      </div>

      {!decks || decks.length === 0 ? (
        <Body1 className="mt-8 text-txt text-opacity-text-primary">
          <Trans>You haven't created any decks yet.</Trans>
        </Body1>
      ) : (
        <div className="mt-6 mb-4">
          <div className={classnames(styles.grid, 'grid gap-4')}>
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
      )}

      <AddDeckForm open={dialogOpen} onClose={handleDialogClose} />
    </>
  )
}

export default DecksSection
