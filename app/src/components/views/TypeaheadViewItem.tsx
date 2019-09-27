import classNames from 'classnames'
import React from 'react'

import { TaggableEntry } from '../editor/TaggableEntry'

import styles from './TypeaheadViewItem.css'

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
      className={classNames(styles.item, 'c-on-surface pointer f6', {
        [styles.itemSelected]: highlighted,
        'relative bg-transparent': highlighted,
      })}
      onMouseEnter={() => onHighlight(entry)}
      onMouseDown={() => onSelect(entry)}
      tabIndex={0}
      role="option"
      aria-selected={highlighted}
    >
      {entry.name}
    </div>
  )
}

export default TypeaheadViewItem
