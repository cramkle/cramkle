const getSelectionRect = (offset: number) => {
  const selection = window.getSelection()

  if (!selection.rangeCount) {
    return null
  }

  const range = selection.getRangeAt(0).cloneRange()

  const endContainer = range.endContainer
  const endOffset = range.endOffset

  if (endOffset >= offset) {
    range.setStart(endContainer, endOffset - offset)
  }

  return range.getBoundingClientRect()
}

export default getSelectionRect
