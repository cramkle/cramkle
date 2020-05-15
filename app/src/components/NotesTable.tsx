import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { getNoteIdentifier } from '../utils/noteIdentifier'
import DeleteNoteDialog from './DeleteNoteDialog'
import { DeckQuery_deck_notes } from './pages/__generated__/DeckQuery'
import Button from './views/Button'
import Card from './views/Card'
import { Table, TableBody, TableCell, TableHead, TableRow } from './views/Table'
import { Body2 } from './views/Typography'

interface Props {
  notes: DeckQuery_deck_notes[]
  deckSlug: string
}

const NotesTable: React.FC<Props> = ({ notes, deckSlug }) => {
  const [deletingNote, setDeletingNote] = useState<DeckQuery_deck_notes | null>(
    null
  )

  const handleDeleteNoteClose = () => {
    setDeletingNote(null)
  }

  if (!notes.length) {
    return (
      <Card
        className="w-full mt-2 py-4 px-2 flex flex-row justify-center"
        outlined
      >
        <Body2>
          <Trans>You haven't created any notes on this deck yet</Trans>
        </Body2>
      </Card>
    )
  }

  return (
    <>
      {deletingNote && (
        <DeleteNoteDialog note={deletingNote} onClose={handleDeleteNoteClose} />
      )}
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Note</Trans>
            </TableCell>
            <TableCell>
              <Trans>Deck</Trans>
            </TableCell>
            <TableCell>
              <Trans>Model type</Trans>
            </TableCell>
            <TableCell>
              <Trans>Flashcards</Trans>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map((note) => {
            const noteIdentifier = getNoteIdentifier(note)

            return (
              <TableRow key={note.id}>
                <TableCell>{noteIdentifier}</TableCell>
                <TableCell>{note.deck.title}</TableCell>
                <TableCell>{note.model.name}</TableCell>
                <TableCell>{note.flashCards.length}</TableCell>
                <TableCell
                  align="right"
                  className="flex items-center justify-end"
                >
                  <Link
                    className="text-action-primary"
                    to={`/d/${deckSlug}/note/${note.id}`}
                  >
                    <Trans>Edit</Trans>
                  </Link>
                  <Button
                    className="ml-3 normal-case tracking-normal"
                    onClick={() => setDeletingNote(note)}
                  >
                    <span className="text-base font-normal">
                      <Trans>Delete</Trans>
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default NotesTable
