import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import CaretLeftIcon from './icons/CaretLeftIcon'
import CaretRightIcon from './icons/CaretRightIcon'
import IconButton from './views/IconButton'
import { Listbox, ListboxOption } from './views/Listbox'

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

export type PageArgs =
  | { after: string | null; first: number }
  | { before: string | null; last: number }

interface Props {
  pageInfo: PageInfo
  pageQuantity?: number
  onPageChange?: (args: PageArgs) => void
  onPageQuantityChange?: (value: number) => void
}

const Pagination: React.FC<Props> = ({
  pageInfo,
  pageQuantity = 10,
  onPageChange,
  onPageQuantityChange,
}) => {
  const { i18n } = useLingui()

  const handlePageChange = (value: string) => {
    onPageQuantityChange?.(parseInt(value, 10))
  }

  const handlePrevPageClick = () => {
    onPageChange?.({ before: pageInfo.startCursor, last: pageQuantity })
  }

  const handleNextPageClick = () => {
    onPageChange?.({ after: pageInfo.endCursor, first: pageQuantity })
  }

  return (
    <div className="flex justify-between">
      <label className="flex items-center text-sm">
        <span>
          <Trans>Rows per page</Trans>
        </span>
        <Listbox
          className="ml-3"
          value={pageQuantity.toString()}
          onChange={handlePageChange}
        >
          <ListboxOption value="5">5</ListboxOption>
          <ListboxOption value="10">10</ListboxOption>
          <ListboxOption value="25">25</ListboxOption>
        </Listbox>
      </label>
      <div className="flex items-center">
        <IconButton
          disabled={!pageInfo.hasPreviousPage}
          onClick={handlePrevPageClick}
          aria-label={i18n._(t`Previous page`)}
        >
          <CaretLeftIcon />
        </IconButton>
        <IconButton
          className="ml-3"
          disabled={!pageInfo.hasNextPage}
          onClick={handleNextPageClick}
          aria-label={i18n._(t`Next page`)}
        >
          <CaretRightIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default Pagination
