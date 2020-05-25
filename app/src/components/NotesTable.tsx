import { Trans, t } from '@lingui/macro'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import DeleteNoteDialog from './DeleteNoteDialog'
import { PageArgs, Pagination } from './Pagination'
import {
  DeckQuery_deck_notes,
  DeckQuery_deck_notes_edges_node,
} from './pages/__generated__/DeckQuery'
import Button from './views/Button'
import { Input } from './views/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from './views/Table'

interface Props {
  notes: DeckQuery_deck_notes
  deckSlug: string
  onPaginationChange: (pageArgs: Partial<PageArgs>) => void
  pageSize: number
  onSearchChange: React.ChangeEventHandler<HTMLInputElement>
  onSearchSubmit: () => void
  searchQuery: string
  totalDeckNotes: number
}

const NotesTable: React.FC<Props> = ({
  notes,
  deckSlug,
  onPaginationChange,
  pageSize,
  onSearchChange,
  onSearchSubmit,
  searchQuery,
  totalDeckNotes,
}) => {
  const [
    deletingNote,
    setDeletingNote,
  ] = useState<DeckQuery_deck_notes_edges_node | null>(null)

  const handleDeleteNoteClose = () => {
    setDeletingNote(null)
  }

  const handleSearchSubmit: React.FormEventHandler = (evt) => {
    evt.preventDefault()
    onSearchSubmit()
  }

  let tableContent = null

  if (!totalDeckNotes) {
    tableContent = (
      <>
        <TableBody>
          <TableRow>
            <TableCell className="text-center text-secondary">
              <Trans>You haven't created any notes on this deck yet</Trans>
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    )
  } else if (!notes.totalCount) {
    tableContent = (
      <>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <Trans>No notes were found</Trans>
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    )
  } else {
    tableContent = (
      <>
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
      </>
    )
  }

  return (
    <>
      {deletingNote && (
        <DeleteNoteDialog note={deletingNote} onClose={handleDeleteNoteClose} />
      )}
      <form className="flex" onSubmit={handleSearchSubmit}>
        <Input
          placeholder={t`Search notes...`}
          onChange={onSearchChange}
          value={searchQuery}
        />
      </form>
      <Table className="w-full mt-3">{tableContent}</Table>
    </>
  )
}

export default NotesTable
