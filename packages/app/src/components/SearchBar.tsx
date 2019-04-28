import IconButton from '@material/react-icon-button'
import Icon from '@material/react-material-icon'
import cx from 'classnames'
import React, { useState, useRef } from 'react'

import styles from './SearchBar.css'

const SearchBar = () => {
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
    >
      <input
        ref={inputRef}
        className="bn w-100 h-100 pv2 bg-transparent outline-0 order-1"
        placeholder="Search"
        name="q"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      {searchValue.length > 0 && (
        <IconButton className="mh1 order-2" onClick={handleClearSearch}>
          <Icon icon="close" />
        </IconButton>
      )}
      <IconButton
        className="mh1 order-0"
        onClick={handleSearchIconClick}
        type="submit"
      >
        <Icon icon="search" />
      </IconButton>
    </form>
  )
}

export default SearchBar
