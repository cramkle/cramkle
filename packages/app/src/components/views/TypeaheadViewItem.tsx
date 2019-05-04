import classNames from 'classnames'
import React from 'react'

import { MentionableEntry } from '../../model/MentionableEntry'

import styles from './TypeaheadViewItem.css'

interface Props {
  highlighted: boolean
  entry: MentionableEntry
  onSelect: (entry: MentionableEntry) => void
  onHighlight: (entry: MentionableEntry) => void
}

const TypeaheadViewItem: React.FunctionComponent<Props> = ({
  highlighted,
  entry,
  onSelect,
  onHighlight,
}) => {
  return (
    <div
      className={classNames(styles.item, {
        [styles.itemSelected]: highlighted,
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
