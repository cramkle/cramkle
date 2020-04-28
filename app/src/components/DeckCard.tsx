import React from 'react'
import { useHistory } from 'react-router'

import Card, { CardPrimaryContent } from './views/Card'
import { Body2, Headline6 } from './views/Typography'

interface Props {
  deck: { id: string; title: string; description?: string | null; slug: string }
  onClick?: (deck: { id: string; title: string; description?: string }) => void
}

const DeckCard: React.FunctionComponent<Props> = ({ onClick, deck }) => {
  const history = useHistory()

  const handleClick = () => {
    if (onClick) {
      onClick(deck)
    } else {
      history.push(`/d/${deck.slug}`)
    }
  }

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
        <Headline6>{deck.title}</Headline6>
        {deck.description && <Body2>{deck.description}</Body2>}
      </CardPrimaryContent>
    </Card>
  )
}

export default DeckCard
