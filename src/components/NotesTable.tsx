import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useState } from 'react'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DeleteNoteDialog from './DeleteNoteDialog'
import { PageArgs, PageCursors, PageInfo, Pagination } from './Pagination'
import EditIcon from './icons/EditIcon'
import TrashBinIcon from './icons/TrashBinIcon'
import {
  DeckQuery_deck_notes,
  DeckQuery_deck_notes_edges,
  DeckQuery_deck_notes_edges_node,
} from './pages/__generated__/DeckQuery'
import Button from './views/Button'
import { Card } from './views/Card'
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
  const navigate = useNavigate()

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
      <Card>
        <div className="p-4 flex items-center justify-between border-b border-divider border-opacity-divider">
          <Button
            className="flex-shrink-0"
            onClick={() => navigate(`${location.pathname}/new-note`)}
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
        <Table className="w-full">
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Note</Trans>
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
                <TableCell colSpan={5} className="text-center" secondary>
                  <Trans>You haven't created any notes on this deck yet</Trans>
                </TableCell>
              </TableRow>
            ) : notes.edges?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Trans>No notes were found</Trans>
                </TableCell>
              </TableRow>
            ) : (
              (notes.edges as DeckQuery_deck_notes_edges[]).map(
                ({ node: note }) => {
                  return (
                    <TableRow key={note!.id}>
                      <TableCell className="max-w-xxs sm:max-w-sm md:max-w-xxs lg:max-w-lg">
                        {note!.text ? (
                          <p className="truncate">{note!.text}</p>
                        ) : (
                          <span className="text-txt text-opacity-text-secondary italic">
                            <Trans>empty note</Trans>
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {note!.model!.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {note!.flashCards.length}
                      </TableCell>
                      <TableCell
                        align="right"
                        className="flex items-center justify-end"
                      >
                        <Link
                          className="text-primary"
                          to={`/d/${deckSlug}/note/${note!.id}`}
                        >
                          <EditIcon aria-label={i18n._(t`Edit`)} />
                        </Link>
                        <Button
                          className="ml-3"
                          onClick={() => setDeletingNote(note)}
                        >
                          <TrashBinIcon aria-label={i18n._(t`Delete`)} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination
                  pageInfo={notes.pageInfo as PageInfo}
                  pageCursors={notes.pageCursors as PageCursors}
                  onChange={onPaginationChange}
                  pageSize={pageSize}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </>
  )
}

export default NotesTable
