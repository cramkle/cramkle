import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'
import { graphql, useFragment } from 'react-relay'
import { useNavigate } from 'react-router'

import FlashCardStatusChip from '../components/FlashCardStatus'
import { Card, CardContent, CardPressable } from '../components/views/Card'
import { Body2, Headline3 } from '../components/views/Typography'
import { FlashCardStatus } from '../globalTypes'
import type {
  RelayDeckCard_deck$data,
  RelayDeckCard_deck$key,
} from './__generated__/RelayDeckCard_deck.graphql'

interface Props {
  deck: RelayDeckCard_deck$key
  onClick?: (deck: RelayDeckCard_deck$data) => void
  showStudySessionDetails?: boolean
}

const DECK_CARD_FRAGMENT = graphql`
  fragment RelayDeckCard_deck on Deck {
    id
    slug
    title
    description
    totalNotes
    totalFlashcards
    studySessionDetails {
      newCount
      learningCount
      reviewCount
    }
  }
`

export const RelayDeckCard: React.FunctionComponent<Props> = ({
  onClick,
  deck,
  showStudySessionDetails = false,
}) => {
  const data = useFragment(DECK_CARD_FRAGMENT, deck)
  const navigate = useNavigate()
  const { i18n } = useLingui()

  const handleClick = () => {
    if (onClick) {
      onClick(data)
    } else {
      navigate(`/d/${data.slug}`)
    }
  }

  const {
    studySessionDetails: { newCount, learningCount, reviewCount },
  } = data

  const uniqueId = `deck-${data.id}`

  return (
    <Card className="h-full">
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
            {data.title}
          </Headline3>
          {data.description && (
            <Body2 className="truncate mb-3">{data.description}</Body2>
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
                plural(data.totalNotes, {
                  one: '# note',
                  other: '# notes',
                })
              )}
              <span className="inline-block mx-1">&middot;</span>
              {i18n._(
                plural(data.totalFlashcards, {
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
