import { SelectionState, getVisibleSelectionRect } from 'draft-js'
import React from 'react'

import InlineStyleControls from './InlineStyleControls'

const InlineStylePopup: React.VFC<{
  selection: SelectionState
  rootRef: React.RefObject<HTMLElement>
}> = ({ selection, rootRef }) => {
  const visibleSelectionRect = getVisibleSelectionRect(window)
  const rootClientRect = rootRef.current?.getBoundingClientRect()

  const left = visibleSelectionRect?.left - (rootClientRect?.left ?? 0)
  const top = visibleSelectionRect?.top - (rootClientRect?.top ?? 0)

  return (
    <div
      className="absolute z-10 top-0 left-0"
      style={{
        transform: `translate(${left}px, ${top}px) translate(0px, -100%)`,
      }}
      hidden={selection.isCollapsed() || !selection.getHasFocus()}
    >
      <div className="relative shadow-xs rounded transform -translate-x-1/2">
        <div className="relative p-1 bg-popover shadow-lg rounded">
          <InlineStyleControls
            hidden={selection.isCollapsed() || !selection.getHasFocus()}
          />
        </div>
      </div>
    </div>
  )
}

export default InlineStylePopup
