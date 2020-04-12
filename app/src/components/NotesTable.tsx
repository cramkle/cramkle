import { Trans } from '@lingui/macro'
import React from 'react'

import Card from 'views/Card'
import { Body2 } from 'views/Typography'

import { DeckQuery_deck_notes } from 'pages/__generated__/DeckQuery'
import Button from './views/Button'

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

  return (
    <div>
      <table className="w-100 ba br3 b--light-gray collapse">
        <thead>
          <tr>
            <th className="h3 tl ph3 lh-copy">
              <Trans>ID</Trans>
            </th>
            <th className="h3 tl ph3 lh-copy">
              <Trans>Model name</Trans>
            </th>
            <th className="h3 tl ph3 lh-copy">
              <Trans>Flashcards</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => {
            return (
              <tr key={note.id} className="bt b--light-gray">
                <td className="ph3">
                  <code>{note.id}</code>
                </td>
                <td className="ph3">{note.model.name}</td>
                <td className="ph3">{note.cards.length}</td>
                <td className="ph3">
                  <Button>
                    <Trans>Edit</Trans>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default NotesTable
