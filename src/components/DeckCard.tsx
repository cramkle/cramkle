import { gql } from '@apollo/client'
import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'
import { useNavigate } from 'react-router'

import { FlashCardStatus } from '../globalTypes'
import FlashCardStatusChip from './FlashCardStatus'
import type { DeckCard_deck } from './__generated__/DeckCard_deck'
import { MarketplaceIcon } from './icons/MarketplaceIcon'
import { Card, CardContent, CardPressable } from './views/Card'
import { Body2, Headline3 } from './views/Typography'

interface Props {
  deck: DeckCard_deck
  onClick?: (deck: DeckCard_deck) => void
  showStudySessionDetails?: boolean
}

export const deckCardFragment = gql`
  fragment DeckCard_deck on Deck {
    id
    slug
    title
    description
    totalNotes
    totalFlashcards
    published
    studySessionDetails {
      newCount
      learningCount
      reviewCount
    }
  }
`

const DeckCard: React.FunctionComponent<Props> = ({
  onClick,
  deck,
  showStudySessionDetails = false,
}) => {
  const navigate = useNavigate()
  const { i18n } = useLingui()

  const handleClick = () => {
    if (onClick) {
      onClick(deck)
    } else {
      navigate(`/d/${deck.slug}`)
    }
  }

  const {
    studySessionDetails: { newCount, learningCount, reviewCount },
  } = deck

  const uniqueId = `deck-${deck.id}`

  return (
    <Card className="h-full">
      {deck.published && (
        <div className="float-right m-2 text-primary-light">
          <MarketplaceIcon />
        </div>
      )}
      <CardPressable
        className="h-full"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) =>
          e.key === 'Enter' && handleClick()
        }
        aria-describedby={`${uniqueId}-title`}
      >
        <CardContent className="h-full flex flex-col">
          <Headline3 id={`${uniqueId}-title`} className="mb-3">
            {deck.title}
          </Headline3>
          {deck.description && (
            <Body2 className="truncate mb-3">{deck.description}</Body2>
          )}
          {showStudySessionDetails ? (
            <div className="flex">
              {newCount > 0 && (
                <FlashCardStatusChip
                  status={FlashCardStatus.NEW}
                  className="mr-4"
                  truncated
                >
                  {i18n._(plural(newCount, { one: '# new', other: '# new' }))}
                </FlashCardStatusChip>
              )}
              {learningCount > 0 && (
                <FlashCardStatusChip
                  status={FlashCardStatus.LEARNING}
                  className="mr-4"
                  truncated
                >
                  {i18n._(
                    plural(learningCount, {
                      one: '# learning',
                      other: '# learning',
                    })
                  )}
                </FlashCardStatusChip>
              )}
              {reviewCount > 0 && (
                <FlashCardStatusChip status={FlashCardStatus.REVIEW} truncated>
                  {i18n._(
                    plural(reviewCount, { one: '# review', other: '# review' })
                  )}
                </FlashCardStatusChip>
              )}
            </div>
          ) : (
            <Body2 className="flex items-center mt-auto">
              {i18n._(
                plural(deck.totalNotes, {
                  one: '# note',
                  other: '# notes',
                })
              )}
              <span className="inline-block mx-1">&middot;</span>
              {i18n._(
                plural(deck.totalFlashcards, {
                  one: '# flashcard',
                  other: '# flashcards',
                })
              )}
            </Body2>
          )}
        </CardContent>
      </CardPressable>
    </Card>
  )
}

export default DeckCard
