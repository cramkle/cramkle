import type { Position } from '@reach/popover'
import { positionDefault, positionMatchWidth } from '@reach/popover'

export const positionMatchMinWidth: Position = (targetRect, popoverRect) => {
  const pos = positionMatchWidth(targetRect, popoverRect)

  return {
    ...pos,
    width: Math.max(pos.width as number, popoverRect?.width ?? 0),
  }
}

export const positionMatchWindowWidth: Position = (targetRect, popoverRect) => {
  const pos = positionDefault(targetRect, popoverRect)

  return {
    ...pos,
    left: '0px',
    width: window.innerWidth,
  }
}

export const positionTop: Position = (targetRect, popoverRect) => {
  const pos = positionDefault(targetRect, popoverRect)

  return {
    ...pos,
    top: undefined,
    bottom: targetRect?.top,
  }
}
