import { Trans, t } from '@lingui/macro'
import * as React from 'react'

import type {
  PublishedDeckQuery_publishedDeck_notes,
  PublishedDeckQuery_publishedDeck_notes_edges,
} from '@src/app/(auth)/(shell)/marketplace/d/[slug]/__generated__/PublishedDeckQuery'

import type { PageArgs, PageCursors, PageInfo } from './Pagination'
import { Pagination } from './Pagination'
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
  notes: PublishedDeckQuery_publishedDeck_notes
  onPaginationChange: (pageArgs: Partial<PageArgs>) => void
  pageSize: number
  onSearchChange: React.ChangeEventHandler<HTMLInputElement>
  onSearchSubmit: () => void
  searchQuery: string
  totalDeckNotes: number
}

const PublishedNotesTable: React.FC<Props> = ({
  notes,
  onPaginationChange,
  pageSize,
  onSearchChange,
  onSearchSubmit,
  searchQuery,
  totalDeckNotes,
}) => {
  const handleSearchSubmit: React.FormEventHandler = (evt) => {
    evt.preventDefault()
    onSearchSubmit()
  }

  return (
    <>
      <Card>
        <div className="p-4 flex items-end border-b border-divider border-opacity-divider">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {totalDeckNotes === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center" secondary>
                  <Trans>This deck does not have any note yet</Trans>
                </TableCell>
              </TableRow>
            ) : notes.edges?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Trans>No notes were found</Trans>
                </TableCell>
              </TableRow>
            ) : (
              (
                notes.edges as PublishedDeckQuery_publishedDeck_notes_edges[]
              ).map(({ node: note }) => {
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
                  </TableRow>
                )
              })
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

export default PublishedNotesTable
