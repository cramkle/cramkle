import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

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
  onRefetchNotes?: () => void
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
  onRefetchNotes,
}) => {
  const [
    deletingNote,
    setDeletingNote,
  ] = useState<DeckQuery_deck_notes_edges_node | null>(null)
  const { i18n } = useLingui()
  const history = useHistory()

  const handleDeleteNoteClose = () => {
    setDeletingNote(null)
  }

  const handleSearchSubmit: React.FormEventHandler = (evt) => {
    evt.preventDefault()
    onSearchSubmit()
  }

  return (
    <>
      {deletingNote && (
        <DeleteNoteDialog
          note={deletingNote}
          onClose={handleDeleteNoteClose}
          onDeleted={onRefetchNotes}
        />
      )}
      <div className="flex items-center justify-between">
        <Button
          className="flex-shrink-0"
          onClick={() => history.push(`${location.pathname}/new-note`)}
        >
          {i18n._(t`Add Note`)}
        </Button>
        <form className="flex ml-4 min-w-0" onSubmit={handleSearchSubmit}>
          <Input
            className="min-w-0"
            placeholder={t`Search notes...`}
            onChange={onSearchChange}
            value={searchQuery}
          />
        </form>
      </div>
      <Table className="w-full mt-3">
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Note</Trans>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Trans>Deck</Trans>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Trans>Model type</Trans>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Trans>Flashcards</Trans>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {totalDeckNotes === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-secondary">
                <Trans>You haven't created any notes on this deck yet</Trans>
              </TableCell>
            </TableRow>
          ) : notes.edges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <Trans>No notes were found</Trans>
              </TableCell>
            </TableRow>
          ) : (
            notes.edges.map(({ node: note }) => {
              return (
                <TableRow key={note.id}>
                  <TableCell>{note.text}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {note.deck.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {note.model.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {note.flashCards.length}
                  </TableCell>
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
            })
          )}
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
