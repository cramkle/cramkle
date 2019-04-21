const getSelectionRect = (offset: number): DOMRect => {
  const selection = window.getSelection()

  if (!selection.rangeCount) {
    return null
  }

  const range = selection.getRangeAt(0).cloneRange()

  const endContainer = range.endContainer
  const endOffset = range.endOffset

  let clientRect = null

  if (endOffset >= offset) {
    range.setStart(endContainer, endOffset - offset)
  }

  clientRect = range.getBoundingClientRect()

  return clientRect as DOMRect
}

export default getSelectionRect
