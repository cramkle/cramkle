import { SelectionState } from 'draft-js'
import React from 'react'

import MentionSpan from './MentionSpan'
import { findMentionEntities } from './strategies'
import getSelectionRect from './getSelectionRect'
import Portal from '../Portal'
import TypeaheadView from '../views/TypeaheadView'
import { MentionableEntry } from '../../model/MentionableEntry'

export const decorators = [
  {
    strategy: findMentionEntities,
    component: MentionSpan,
  },
]

interface Props {
  mentionableEntries: MentionableEntry[]
  highlightedMentionable?: MentionableEntry
  onMentionSelect: (mention: MentionableEntry) => void
  onMentionHighlight: (mention: MentionableEntry) => void
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
  selectionRect: ClientRect,
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
  onMentionHighlight,
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

  const style = getStyleForSelectionRect(selectionRect, offset)

  return (
    <Portal>
      <TypeaheadView
        style={style}
        highlightedEntry={highlightedMentionable}
        entries={mentionableEntries}
        onSelect={onMentionSelect}
        onHighlight={onMentionHighlight}
      />
    </Portal>
  )
}

export default MentionsPopup
