import Card from '@material/react-card'
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
  onMentionSelect: (mention: MentionableEntry, evt: React.MouseEvent) => void
  selection: SelectionState
  offset?: number
  characterOffset: number
}

const findRelativeParentElement = (
  element: HTMLElement
): HTMLElement | null => {
  if (!element) {
    return null
  }

  const position = window.getComputedStyle(element).getPropertyValue('position')
  if (position !== 'static') {
    return element
  }

  return findRelativeParentElement(element.parentElement)
}

const getStyleForSelectionRect = (
  selectionRect: DOMRect,
  offset: number
): object => {
  const parent = findRelativeParentElement(
    document.getElementById('portal-anchor')
  )

  const relativeRect = {
    scrollLeft: 0,
    scrollTop: 0,
    left: 0,
    top: 0,
  }

  if (parent) {
    relativeRect.scrollLeft = parent.scrollLeft
    relativeRect.scrollTop = parent.scrollTop

    const relativeParentRect = parent.getBoundingClientRect()
    relativeRect.left = selectionRect.left - relativeParentRect.left
    relativeRect.top = selectionRect.bottom - relativeParentRect.top
  } else {
    relativeRect.scrollTop =
      window.pageYOffset || document.documentElement.scrollTop
    relativeRect.scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft

    relativeRect.top = selectionRect.bottom
    relativeRect.left = selectionRect.left
  }

  const left = relativeRect.left + relativeRect.scrollLeft + offset
  const top = relativeRect.top + relativeRect.scrollTop + offset

  return {
    left,
    top,
  }
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

  const style = getStyleForSelectionRect(selectionRect, offset)

  return (
    <Portal>
      <Card style={style} className="pv2 z-2 absolute">
        <List selectedIndex={highlightedMentionableIndex} dense>
          {mentionableEntries.map(mentionable => (
            <ListItem
              key={mentionable.id}
              tabIndex={0}
              onClick={evt => onMentionSelect(mentionable, evt)}
            >
              <ListItemText primaryText={mentionable.name} />
            </ListItem>
          ))}
        </List>
      </Card>
    </Portal>
  )
}

export default MentionsPopup
