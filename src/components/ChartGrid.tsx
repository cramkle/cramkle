import React from 'react'

import { BandedScale, TickScale } from './Axis'

interface Props<T> extends React.SVGProps<SVGGElement> {
  scaler: BandedScale<T> | TickScale<T>
  orientation?: 'vertical' | 'horizontal'
  ticks?: number
  inlineStart: number
  inlineEnd: number
  tickKeyFn?: (tick: T) => number | string
}

export default function ChartGrid<T>({
  scaler,
  ticks,
  inlineStart,
  inlineEnd,
  tickKeyFn,
  orientation = 'vertical',
  stroke = 'currentColor',
  strokeOpacity = 0.1,
  ...props
}: Props<T>) {
  const values = 'ticks' in scaler ? scaler.ticks(ticks) : scaler.domain()

  const lineProps =
    orientation === 'vertical'
      ? {
          x1: inlineStart,
          x2: inlineEnd,
        }
      : {
          y1: inlineStart,
          y2: inlineEnd,
        }

  return (
    <g {...props} stroke={stroke} strokeOpacity={strokeOpacity}>
      {values.map((tick) => {
        const position = 0.5 + scaler(tick)

        const positionProps =
          orientation === 'vertical'
            ? {
                y1: position,
                y2: position,
              }
            : {
                x1: position,
                x2: position,
              }

        return (
          <line
            key={tickKeyFn?.(tick) ?? tick.toString()}
            {...lineProps}
            {...positionProps}
          />
        )
      })}
    </g>
  )
}
