import { Trans } from '@lingui/macro'
import React from 'react'

import Card from 'views/Card'
import { Body2 } from 'views/Typography'

import { DeckQuery_deck_notes } from 'pages/__generated__/DeckQuery'

interface Props {
  notes: DeckQuery_deck_notes[]
}

const NotesTable: React.FC<Props> = ({ notes }) => {
  if (!notes.length) {
    return (
      <Card className="w-100 mt2 pv3 ph2 flex flex-row justify-center" outlined>
        <Body2>
          <Trans>You haven't created any notes on this deck yet</Trans>
        </Body2>
      </Card>
    )
  }

  return <span>hello</span>
}

export default NotesTable
