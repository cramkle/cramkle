import { ReactNode } from 'react'
import * as React from 'react'

function number<T>(scale: TickScale<T>) {
  return (d: T) => +(scale(d) ?? 0)
}

function center<T>(scale: BandedScale<T>) {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2 // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset)
  return (d: T) => +(scale(d) ?? 0) + offset
}

function translateX(x: number) {
  return 'translate(' + (x + 0.5) + ',0)'
}

function translateY(y: number) {
  return 'translate(0,' + (y + 0.5) + ')'
}

export type BandedScale<T> = {
  (x: T): number | undefined
  domain(): Array<T>
  range(): Array<number>
  copy(): BandedScale<T>
  bandwidth(): number
  round(): boolean
}

export type TickScale<T> = {
  (x: T): number | undefined
  domain(): Array<T>
  range(): Array<number>
  ticks(count: number): Array<T>
  copy(): TickScale<T>
}

interface AxisProps<T> extends Omit<React.SVGProps<SVGGElement>, 'transform'> {
  orientation?: 'top' | 'bottom' | 'left' | 'right'
  scaler: BandedScale<T> | TickScale<T>
  ticks?: number
  tickKeyFn?: (tick: T) => number | string
  tickLabel?: (tick: T) => ReactNode
  tickSizeOuter?: number
  tickSizeInner?: number
  tickPadding?: number
  offset: number
  hideDomainLine?: boolean
  domainLineProps?: Omit<React.SVGProps<SVGPathElement>, 'd'>
  prefix?: ReactNode
  suffix?: ReactNode
}

export default function Axis<T>({
  orientation = 'left',
  scaler,
  ticks = 0,
  tickKeyFn,
  tickLabel,
  tickSizeInner = 6,
  tickSizeOuter = 6,
  tickPadding = 3,
  offset,
  hideDomainLine = false,
  textAnchor = 'middle',
  fontSize = '1rem',
  domainLineProps = {
    stroke: 'currentColor',
  },
  prefix = null,
  suffix = null,
  ...props
}: AxisProps<T>) {
  const range = scaler.range()
  const [minRange] = range
  const maxRange = range[range.length - 1]
  const isVerticalOrientation =
    orientation === 'top' || orientation === 'bottom'
  const spacing = Math.max(tickSizeInner, 0) + tickPadding
  const k = orientation === 'left' || orientation === 'top' ? -1 : 1
  const x = isVerticalOrientation ? 'y' : 'x'
  const transform = isVerticalOrientation ? translateX : translateY
  const position =
    'bandwidth' in scaler ? center(scaler.copy()) : number(scaler.copy())
  const axisPath = !isVerticalOrientation
    ? tickSizeOuter
      ? 'M' +
        k * tickSizeOuter +
        ',' +
        minRange +
        'H0.5V' +
        maxRange +
        'H' +
        k * tickSizeOuter
      : 'M0.5,' + minRange + 'V' + maxRange
    : tickSizeOuter
    ? 'M' +
      minRange +
      ',' +
      k * tickSizeOuter +
      'V0.5H' +
      maxRange +
      'V' +
      k * tickSizeOuter
    : 'M' + minRange + ',0.5H' + maxRange

  const values = 'ticks' in scaler ? scaler.ticks(ticks) : scaler.domain()

  return (
    <g
      {...props}
      transform={`translate(${
        isVerticalOrientation ? `0, ${offset}` : `${offset}, 0`
      })`}
      fontSize={fontSize}
      textAnchor={textAnchor}
    >
      {prefix}
      {!hideDomainLine && <path {...domainLineProps} d={axisPath} />}
      {values.map((tick) => (
        <g
          key={tickKeyFn?.(tick) ?? (tick as any).toString()}
          transform={transform(position(tick))}
        >
          <line stroke="currentColor" {...{ [x + '2']: k * tickSizeInner }} />
          <text
            fill="currentColor"
            {...{ [x]: k * spacing }}
            dy={
              orientation === 'top'
                ? '0em'
                : orientation === 'bottom'
                ? '0.71em'
                : '0.32em'
            }
          >
            {tickLabel?.(tick) ?? tick}
          </text>
        </g>
      ))}
      {suffix}
    </g>
  )
}
