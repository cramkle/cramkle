import React from 'react'

import { TaggableEntry } from '../editor/TaggableEntry'
import TypeaheadViewItem from './TypeaheadViewItem'

interface Props extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
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
    <div style={style} className="absolute z-20 bg-surface rounded shadow-lg">
      <ul className="py-2 rounded shadow-xs overflow-hidden" role="listbox">
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
    </div>
  )
}

export default TypeaheadView
