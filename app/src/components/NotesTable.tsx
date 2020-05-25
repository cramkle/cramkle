import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import DeleteNoteDialog from './DeleteNoteDialog'
import { PageArgs, Pagination } from './Pagination'
import {
  DeckQuery_deck_notes,
  DeckQuery_deck_notes_edges_node,
} from './pages/__generated__/DeckQuery'
import Button from './views/Button'
import Card from './views/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from './views/Table'
import { Body2 } from './views/Typography'

interface Props {
  notes: DeckQuery_deck_notes
  deckSlug: string
  onPaginationChange: (pageArgs: Partial<PageArgs>) => void
  pageSize: number
}

const NotesTable: React.FC<Props> = ({
  notes,
  deckSlug,
  onPaginationChange,
  pageSize,
}) => {
  const [
    deletingNote,
    setDeletingNote,
  ] = useState<DeckQuery_deck_notes_edges_node | null>(null)

  const handleDeleteNoteClose = () => {
    setDeletingNote(null)
  }

  if (!notes.edges.length) {
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
          {notes.edges.map(({ node: note }) => {
            return (
              <TableRow key={note.id}>
                <TableCell>{note.text}</TableCell>
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
                    className="ml-3"
                    onClick={() => setDeletingNote(note)}
                  >
                    <Trans>Delete</Trans>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <Pagination
                pageInfo={notes.pageInfo}
                pageCursors={notes.pageCursors}
                onChange={onPaginationChange}
                pageSize={pageSize}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}

export default NotesTable
