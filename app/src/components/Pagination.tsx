import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import React from 'react'

import CaretLeftIcon from './icons/CaretLeftIcon'
import CaretRightIcon from './icons/CaretRightIcon'
import FirstPageIcon from './icons/FirstPageIcon'
import LastPageIcon from './icons/LastPageIcon'
import Button from './views/Button'
import IconButton from './views/IconButton'
import { Listbox, ListboxOption } from './views/Listbox'

interface PageCursor {
  cursor: string
  page: number
  isCurrent: boolean
}

interface PageCursors {
  first?: PageCursor
  around: PageCursor[]
  last?: PageCursor
  previous?: PageCursor
}

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor?: string
  startCursor?: string
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
    onChange({ page: pageCursors.first.page })
  }

  const handleLastPageClick = () => {
    onChange({ page: pageCursors.last.page })
  }

  const handlePrevPageClick = () => {
    onChange({ page: pageCursors.previous.page })
  }

  const handleNextPageClick = () => {
    onChange({ page: currentPage.page + 1 })
  }

  const handlePageClick = (page: number) => {
    onChange({ page })
  }

  return (
    <div className="flex justify-between">
      <label className="flex items-center text-sm">
        <span>
          <Trans>Items per page</Trans>
        </span>
        <Listbox
          className="ml-3"
          value={pageSize.toString()}
          onChange={handlePageSizeChange}
        >
          <ListboxOption value="5">5</ListboxOption>
          <ListboxOption value="10">10</ListboxOption>
          <ListboxOption value="25">25</ListboxOption>
        </Listbox>
      </label>
      <div className="flex items-center">
        <IconButton
          disabled={!pageCursors.first}
          onClick={handleFirstPageClick}
          aria-label={i18n._(t`First page`)}
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          className="mr-1"
          disabled={!pageCursors.previous}
          onClick={handlePrevPageClick}
          aria-label={i18n._(t`Previous page`)}
        >
          <CaretLeftIcon />
        </IconButton>
        {pageCursors.around.map((pageCursor) => (
          <Button
            className={classnames('mr-1', {
              'bg-gray-1': pageCursor.isCurrent,
            })}
            variation="plain"
            key={pageCursor.cursor}
            onClick={() => handlePageClick(pageCursor.page)}
          >
            <span className="text-primary">{pageCursor.page}</span>
          </Button>
        ))}
        <IconButton
          disabled={!pageInfo.hasNextPage}
          onClick={handleNextPageClick}
          aria-label={i18n._(t`Next page`)}
        >
          <CaretRightIcon />
        </IconButton>
        <IconButton
          disabled={!pageCursors.last}
          onClick={handleLastPageClick}
          aria-label={i18n._(t`Last page`)}
        >
          <LastPageIcon />
        </IconButton>
      </div>
    </div>
  )
}
