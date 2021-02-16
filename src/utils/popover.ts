import type { Position } from '@reach/popover'
import { positionMatchWidth } from '@reach/popover'

export const positionMatchMinWidth: Position = (targetRect, popoverRect) => {
  const pos = positionMatchWidth(targetRect, popoverRect)

  return {
    ...pos,
    width: Math.max(pos.width as number, popoverRect?.width ?? 0),
  }
}
