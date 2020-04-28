import React from 'react'

import { TaggableEntry } from '../editor/TaggableEntry'
import TypeaheadViewItem from './TypeaheadViewItem'

interface Props {
  style?: object
  highlightedEntry: TaggableEntry | null
  entries: TaggableEntry[]
  onSelect: (entry: TaggableEntry) => void
  onHighlight: (entry: TaggableEntry) => void
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
      className="absolute z-20 bg-surface py-2 rounded shadow-4"
      role="listbox"
    >
      {entries.map((entry) => {
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
