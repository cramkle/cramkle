import { gql } from '@apollo/client'
import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import type { PublishedDeckCard_deck } from './__generated__/PublishedDeckCard_deck'
import { MarketplaceIcon } from './icons/MarketplaceIcon'
import { Card, CardContent, CardPressable } from './views/Card'
import { Body2, Caption, Headline3 } from './views/Typography'

interface Props {
  deck: PublishedDeckCard_deck
  onClick?: (deck: PublishedDeckCard_deck) => void
}

export const publishedDeckCardFragment = gql`
  fragment PublishedDeckCard_deck on Deck {
    id
    slug
    title
    description
    totalNotes
    totalFlashcards
    published
    owner {
      username
    }
  }
`

const PublishedDeckCard: React.FunctionComponent<Props> = ({
  onClick,
  deck,
}) => {
  const router = useRouter()
  const { i18n } = useLingui()

  const handleClick = () => {
    if (onClick) {
      onClick(deck)
    } else {
      router.push(`/marketplace/d/${deck.slug}`)
    }
  }

  const uniqueId = `deck-${deck.id}`
  const publisherName = deck?.owner?.username

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
          <Headline3 id={`${uniqueId}-title`}>{deck.title}</Headline3>
          <Caption className="mb-3">by {publisherName}</Caption>
          {deck.description && (
            <Body2 className="truncate mb-3">{deck.description}</Body2>
          )}
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
        </CardContent>
      </CardPressable>
    </Card>
  )
}

export default PublishedDeckCard
