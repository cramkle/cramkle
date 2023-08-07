import { Button } from '@chakra-ui/react'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import * as React from 'react'

import { CaretLeftIcon } from './icons/CaretLeftIcon'
import { CaretRightIcon } from './icons/CaretRightIcon'
import { FirstPageIcon } from './icons/FirstPageIcon'
import { LastPageIcon } from './icons/LastPageIcon'
import { Listbox, ListboxOption } from './views/Listbox'

interface PageCursor {
  cursor: string
  page: number
  isCurrent: boolean
}

export interface PageCursors {
  first?: PageCursor
  around: PageCursor[]
  last?: PageCursor
  previous?: PageCursor
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor?: string
}

export type PageArgs = { page: number; size: number }

interface Props {
  pageInfo: PageInfo
  pageCursors: PageCursors
  pageSize?: number
  onChange?: (pageArgs: Partial<PageArgs>) => void
}

export const Pagination: React.FC<Props> = ({
  pageCursors,
  pageInfo,
  pageSize = 10,
  onChange = () => {},
}) => {
  const { i18n } = useLingui()

  const currentPage = pageCursors.around.find((page) => page.isCurrent)

  const handlePageSizeChange = (value: string) => {
    onChange({ page: 1, size: parseInt(value, 10) })
  }

  const handleFirstPageClick = () => {
    if (pageCursors.first?.page) {
      onChange({ page: pageCursors.first.page })
    }
  }

  const handleLastPageClick = () => {
    if (pageCursors.last?.page) {
      onChange({ page: pageCursors.last.page })
    }
  }

  const handlePrevPageClick = () => {
    if (pageCursors.previous?.page) {
      onChange({ page: pageCursors.previous.page })
    }
  }

  const handleNextPageClick = () => {
    onChange({ page: (currentPage?.page ?? 0) + 1 })
  }

  const handlePageClick = (page: number) => {
    onChange({ page })
  }

  return (
    <div className="flex flex-col sm:flex-row py-3 sm:py-0 justify-between">
      <label className="flex items-center text-sm">
        <span className="text-txt text-opacity-text-primary">
          <Trans>Items per page</Trans>
        </span>
        <Listbox
          className="ml-3"
          value={pageSize.toString()}
          onChange={handlePageSizeChange}
        >
          <ListboxOption disabled value="0">
            <Trans>Items per page</Trans>
          </ListboxOption>
          <ListboxOption value="5">5</ListboxOption>
          <ListboxOption value="10">10</ListboxOption>
          <ListboxOption value="25">25</ListboxOption>
        </Listbox>
      </label>
      <div className="flex items-center mt-3 mx-auto sm:mt-0 sm:mx-0 text-txt text-opacity-text-primary">
        <Button
          className="hidden sm:block"
          disabled={!pageCursors.first}
          onClick={handleFirstPageClick}
          aria-label={i18n._(t`First page`)}
        >
          <FirstPageIcon />
        </Button>
        <Button
          className="mr-1"
          disabled={!pageCursors.previous}
          onClick={handlePrevPageClick}
          aria-label={i18n._(t`Previous page`)}
        >
          <CaretLeftIcon />
        </Button>
        {pageCursors.around.map((pageCursor) => (
          <Button
            className={classnames('mr-1', {
              'bg-surface': pageCursor.isCurrent,
            })}
            key={pageCursor.cursor}
            onClick={() => handlePageClick(pageCursor.page)}
          >
            <span className="text-txt text-opacity-text-primary">
              {pageCursor.page}
            </span>
          </Button>
        ))}
        <Button
          disabled={!pageInfo.hasNextPage}
          onClick={handleNextPageClick}
          aria-label={i18n._(t`Next page`)}
        >
          <CaretRightIcon />
        </Button>
        <Button
          className="hidden sm:block"
          disabled={!pageCursors.last}
          onClick={handleLastPageClick}
          aria-label={i18n._(t`Last page`)}
        >
          <LastPageIcon />
        </Button>
      </div>
    </div>
  )
}
