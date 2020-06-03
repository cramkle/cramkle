import classnames from 'classnames'
import React from 'react'

import { TaggableEntry } from '../editor/TaggableEntry'

interface Props {
  highlighted: boolean
  entry: TaggableEntry
  onSelect: (entry: TaggableEntry) => void
  onHighlight: (entry: TaggableEntry) => void
}

const TypeaheadViewItem: React.FunctionComponent<Props> = ({
  highlighted,
  entry,
  onSelect,
  onHighlight,
}) => {
  return (
    <div
      className={classnames(
        'px-2 py-3 text-on-surface cursor-pointer text-sm',
        {
          'text-action-primary': highlighted,
          'relative bg-transparent': highlighted,
        }
      )}
      onMouseEnter={() => onHighlight(entry)}
      onMouseDown={() => onSelect(entry)}
      tabIndex={0}
      role="option"
      aria-selected={highlighted}
    >
      {entry.name}
      <div
        className={classnames(
          'absolute top-0 left-0 right-0 bottom-0 opacity-12 bg-primary pointer-events-none',
          { hidden: !highlighted }
        )}
      />
    </div>
  )
}

export default TypeaheadViewItem
