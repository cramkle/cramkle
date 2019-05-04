import classNames from 'classnames'
import React from 'react'

import TypeaheadViewItem from './TypeaheadViewItem'
import { MentionableEntry } from '../../model/MentionableEntry'

import styles from './TypeaheadView.css'

interface Props {
  style?: object
  highlightedEntry: MentionableEntry
  entries: MentionableEntry[]
  onSelect: (entry: MentionableEntry) => void
  onHighlight: (entry: MentionableEntry) => void
}

const TypeaheadView: React.FunctionComponent<Props> = ({
  style,
  highlightedEntry,
  entries,
  onSelect,
  onHighlight,
}) => {
  return (
    <ul
      style={style}
      className={classNames(styles.container, 'absolute z-2')}
      role="listbox"
    >
      {entries.map(entry => {
        const highlighted = highlightedEntry === entry

        return (
          <TypeaheadViewItem
            key={entry.id}
            entry={entry}
            highlighted={highlighted}
            onSelect={onSelect}
            onHighlight={onHighlight}
          />
        )
      })}
    </ul>
  )
}

export default TypeaheadView
