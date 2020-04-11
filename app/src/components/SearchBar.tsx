import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import cx from 'classnames'
import React, { useRef, useState } from 'react'

import Icon from 'views/Icon'
import IconButton from 'views/IconButton'

import styles from './SearchBar.css'

const SearchBar: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isFocused, setFocused] = useState(false)

  const handleSearchIconClick = () => {
    inputRef.current.focus()
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: go to search page
    // eslint-disable-next-line no-console
    console.log(searchValue)
  }

  const handleClearSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    setSearchValue('')
    inputRef.current.focus()
  }

  return (
    <form
      className={cx(
        styles.searchForm,
        { [styles.searchFormFocused]: isFocused, 'shadow-1': isFocused },
        'inline-flex items-center center pv1'
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <input
        ref={inputRef}
        className="bn w-100 h-100 pv2 bg-transparent outline-0 order-1"
        placeholder={i18n._(t`Search`)}
        name="q"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue.length > 0 && (
        <IconButton
          className="mh1 order-2"
          onClick={handleClearSearch}
          aria-label={i18n._(t`Clear search`)}
        >
          <Icon icon="close" aria-hidden="true" />
        </IconButton>
      )}
      <IconButton
        className="mh1 order-0"
        onClick={handleSearchIconClick}
        type="submit"
        aria-label={i18n._(t`Search`)}
      >
        <Icon icon="search" aria-hidden="true" />
      </IconButton>
    </form>
  )
}

export default SearchBar
