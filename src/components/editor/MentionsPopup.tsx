import List, { ListItem, ListItemText } from '@material/react-list'
import { SelectionState } from 'draft-js'
import React from 'react'

import MentionSpan from './MentionSpan'
import Portal from '../Portal'
import { findMentionEntities } from './strategies'
import getSelectionRect from './getSelectionRect'

export const decorators = [
  {
    strategy: findMentionEntities,
    component: MentionSpan,
  },
]

export interface MentionableEntry {
  id: string
  name: string
}

interface Props {
  mentionableEntries: MentionableEntry[]
  highlightedMentionable?: MentionableEntry
  onMentionSelect: (mention: MentionableEntry, evt: React.KeyboardEvent) => void
  selection: SelectionState
  offset?: number
  characterOffset: number
}

const MentionsPopup: React.FunctionComponent<Props> = ({
  onMentionSelect,
  mentionableEntries,
  highlightedMentionable,
  offset = 5,
  characterOffset,
  selection,
}) => {
  const selectionRect = getSelectionRect(characterOffset)

  const show =
    selection.isCollapsed() &&
    selection.getHasFocus() &&
    mentionableEntries.length

  if (!show) {
    return null
  }

  const highlightedMentionableIndex = mentionableEntries.indexOf(
    highlightedMentionable
  )

  return (
    <Portal>
      <div
        style={{
          top: selectionRect.y + offset,
          left: selectionRect.x + offset,
        }}
        className="pv2 ba b--near-black z-2 absolute bg-white"
      >
        <List selectedIndex={highlightedMentionableIndex} dense>
          {mentionableEntries.map(mentionable => (
            <ListItem
              key={mentionable.id}
              onClick={evt => onMentionSelect(mentionable, evt)}
            >
              <ListItemText primaryText={mentionable.name} />
            </ListItem>
          ))}
        </List>
      </div>
    </Portal>
  )
}

export default MentionsPopup
