import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React from 'react'
import { useHistory } from 'react-router'

import { FlashCardStatus } from '../globalTypes'
import FlashCardStatusChip from './FlashCardStatus'
import { DeckCard_deck } from './__generated__/DeckCard_deck'
import Card, { CardPrimaryContent } from './views/Card'
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
  const history = useHistory()
  const { i18n } = useLingui()

  const handleClick = () => {
    if (onClick) {
      onClick(deck)
    } else {
      history.push(`/d/${deck.slug}`)
    }
  }

  const {
    studySessionDetails: { newCount, learningCount, reviewCount },
  } = deck

  return (
    <Card outlined className="h-full">
      <CardPrimaryContent
        className="p-2 h-full"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) =>
          e.key === 'Enter' && handleClick()
        }
      >
        <Headline3>{deck.title}</Headline3>
        {deck.description && <Body2>{deck.description}</Body2>}
        {showStudySessionDetails && (
          <div className="mt-1 flex">
            {newCount > 0 && (
              <FlashCardStatusChip
                status={FlashCardStatus.NEW}
                className="mr-2"
                truncated
              >
                {i18n._(plural(newCount, { one: '# new', other: '# new' }))}
              </FlashCardStatusChip>
            )}
            {learningCount > 0 && (
              <FlashCardStatusChip
                status={FlashCardStatus.LEARNING}
                className="mr-2"
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
        )}
      </CardPrimaryContent>
    </Card>
  )
}

export default DeckCard