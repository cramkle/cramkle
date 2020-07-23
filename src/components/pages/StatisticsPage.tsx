import { useQuery } from '@apollo/react-hooks'
import { Trans, plural, select } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { extent, max } from 'd3-array'
import { scaleLinear, scaleTime } from 'd3-scale'
import { curveMonotoneX, line } from 'd3-shape'
import { addMinutes, differenceInDays, startOfToday, subDays } from 'date-fns'
import gql from 'graphql-tag'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import Axis from '../Axis'
import BackButton from '../BackButton'
import ChartGrid from '../ChartGrid'
import { Card } from '../views/Card'
import Container from '../views/Container'
import { Listbox, ListboxOption } from '../views/Listbox'
import {
  Body1,
  Body2,
  Headline1,
  Headline2,
  Overline,
} from '../views/Typography'
import {
  DeckStatistics,
  DeckStatisticsVariables,
  DeckStatistics_deckStatistics_studyFrequency,
} from './__generated__/DeckStatistics'

type TransformedStudyFrequency = Omit<
  DeckStatistics_deckStatistics_studyFrequency,
  'date'
> & {
  date: Date
}

const STATISTICS_QUERY = gql`
  query DeckStatistics($deckId: ID, $startDate: String!, $endDate: String!) {
    deckStatistics(deckId: $deckId) {
      deck {
        id
        title
      }
      totalStudyTime
      totalTimesStudied
      totalFlashcardsStudied
      studyFrequency(startDate: $startDate, endDate: $endDate) {
        date
        learning
        new
      }
    }
    decks {
      id
      title
    }
  }
`

const getChartDimensions = (width: number) => {
  if (width > 480) {
    return {
      height: 500,
      margin: {
        left: 32,
        right: 32,
        top: 32,
        bottom: 32,
      },
    }
  }

  return {
    height: 300,
    margin: {
      left: 32,
      right: 16,
      top: 16,
      bottom: 32,
    },
  }
}

const StatisticsCard: React.FC<{ label: ReactNode; value: ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col">
        <Overline className="text-secondary">{label}</Overline>
        <span className="mt-1 text-3xl md:text-4xl font-medium">{value}</span>
      </div>
    </Card>
  )
}

const StatisticsPage: React.FC = () => {
  const [interval, setIntervalValue] = useState('7')
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null)

  const { current: today } = useRef(startOfToday())
  const startDate = subDays(today, parseInt(interval, 10))

  const { loading, data } = useQuery<DeckStatistics, DeckStatisticsVariables>(
    STATISTICS_QUERY,
    {
      variables: {
        deckId: selectedDeck,
        startDate: startDate.toISOString(),
        endDate: today.toISOString(),
      },
      fetchPolicy: 'cache-and-network',
      partialRefetch: true,
    }
  )

  const { i18n } = useLingui()

  useTopBarLoading(loading)

  const studyTime = useMemo(() => {
    let time = data?.deckStatistics?.totalStudyTime ?? 0
    let unit = 'millisecond'

    if (time > 1000) {
      time /= 1000
      unit = 'second'
    }
    if (time > 60 && unit === 'second') {
      time /= 60
      unit = 'minute'
    }
    if (time > 60 && unit === 'minute') {
      time /= 60
      unit = 'hour'
    }
    if (time > 24 && unit === 'hour') {
      time /= 24
      unit = 'day'
    }

    return {
      time,
      unit,
    }
  }, [data?.deckStatistics?.totalStudyTime])

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  const { height, margin } = getChartDimensions(width)

  useEffect(() => {
    if (!chartContainerRef.current) {
      return
    }

    const chartContainerNode = chartContainerRef.current
    const chartContainerRect = chartContainerNode.getBoundingClientRect()

    setWidth(chartContainerRect.width)

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })

    observer.observe(chartContainerNode)

    return () => observer.unobserve(chartContainerNode)
  }, [chartContainerRef.current])

  const studyFrequency = useMemo(
    () =>
      (data?.deckStatistics?.studyFrequency ?? []).map((frequency) => ({
        ...frequency,
        date: addMinutes(
          frequency.date,
          new Date(frequency.date).getTimezoneOffset()
        ),
      })),
    [data?.deckStatistics?.studyFrequency]
  )

  const frequencyX = scaleTime()
    .domain(extent(studyFrequency, (data) => data.date))
    .range([margin.left, width - margin.right])

  const frequencyY = scaleLinear()
    .domain([
      0,
      Math.max(
        max(studyFrequency, (d) => d.learning),
        max(studyFrequency, (d) => d.new)
      ),
    ])
    .nice()
    .range([height - margin.bottom, margin.top])

  const learningLineShape = line<TransformedStudyFrequency>()
    .x((d) => frequencyX(d.date))
    .curve(curveMonotoneX)
    .y((d) => frequencyY(d.learning))
  const newLineShape = line<TransformedStudyFrequency>()
    .x((d) => frequencyX(d.date))
    .curve(curveMonotoneX)
    .y((d) => frequencyY(d.new))

  const learningLine = learningLineShape(studyFrequency)
  const newLine = newLineShape(studyFrequency)

  const daysInterval = differenceInDays(today, startDate)

  const formattedStudyTime = i18n.number(studyTime.time, {
    style: 'decimal',
    maximumFractionDigits: 2,
  })

  if (!data) {
    return null
  }

  return (
    <Container>
      <BackButton to="/" />

      <Headline1>
        <Trans>Deck Statistics</Trans>
      </Headline1>

      <Listbox
        className="mt-3"
        value={data.deckStatistics.deck.id}
        onChange={setSelectedDeck}
      >
        {data.decks.map((deck) => (
          <ListboxOption key={deck.id} value={deck.id}>
            {deck.title}
          </ListboxOption>
        ))}
      </Listbox>

      <Headline2 className="mt-12">
        <Trans>Overview</Trans>
      </Headline2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-6">
        <StatisticsCard
          label={<Trans>Total study time</Trans>}
          value={select(studyTime.unit, {
            millisecond: plural(studyTime.time, {
              one: `${formattedStudyTime} millisecond`,
              other: `${formattedStudyTime} milliseconds`,
            }),
            second: plural(studyTime.time, {
              one: `${formattedStudyTime} second`,
              other: `${formattedStudyTime} seconds`,
            }),
            minute: plural(studyTime.time, {
              one: `${formattedStudyTime} minute`,
              other: `${formattedStudyTime} minutes`,
            }),
            hour: plural(studyTime.time, {
              one: `${formattedStudyTime} hour`,
              other: `${formattedStudyTime} hours`,
            }),
            day: plural(studyTime.time, {
              one: `${formattedStudyTime} day`,
              other: `${formattedStudyTime} days`,
            }),
          })}
        />
        <StatisticsCard
          label={<Trans>Number of times studied</Trans>}
          value={data.deckStatistics.totalTimesStudied}
        />
        <StatisticsCard
          label={<Trans>Number of flashcards studied</Trans>}
          value={data.deckStatistics.totalFlashcardsStudied}
        />
      </div>

      <Card className="mt-12">
        <div className="border-b border-secondary flex flex-wrap justify-between items-center p-2">
          <Headline2 className="m-2">
            <Trans>Study frequency</Trans>
          </Headline2>

          <label className="m-2 flex items-center">
            <Trans>Interval</Trans>
            <Listbox
              className="ml-3"
              value={interval}
              onChange={(value) => setIntervalValue(value)}
            >
              <ListboxOption value="7">
                <Trans>7 days</Trans>
              </ListboxOption>
              <ListboxOption value="30">
                <Trans>1 month</Trans>
              </ListboxOption>
              <ListboxOption value="365">
                <Trans>1 year</Trans>
              </ListboxOption>
            </Listbox>
          </label>
        </div>

        <div className="w-100" ref={chartContainerRef}>
          {data.deckStatistics.studyFrequency.length > 0 ? (
            <svg
              className="w-full py-2 px-4"
              viewBox={`0 0 ${width} ${height}`}
              height={height}
            >
              <Axis
                fontSize="10px"
                orientation="left"
                offset={margin.left}
                scaler={frequencyY}
                tickSizeOuter={1}
                ticks={5}
                textAnchor="end"
                domainLineProps={{
                  stroke: 'currentColor',
                  strokeOpacity: 0.1,
                  fill: 'none',
                }}
                prefix={
                  <>
                    <text
                      x={-margin.left}
                      y={width > 480 ? 12 : 6}
                      fill="currentColor"
                      textAnchor="start"
                    >
                      <Trans>Flashcards studied</Trans>
                    </text>
                  </>
                }
              />
              <Axis
                fontSize="10px"
                orientation="bottom"
                offset={height - margin.bottom}
                scaler={frequencyX}
                ticks={interval === '7' ? 7 : width / 80}
                tickKeyFn={(tick) => tick.getTime()}
                tickLabel={(tick) =>
                  i18n.date(tick, {
                    day: daysInterval <= 30 ? 'numeric' : undefined,
                    month:
                      daysInterval <= 30
                        ? 'short'
                        : daysInterval <= 365
                        ? 'long'
                        : undefined,
                    year: daysInterval > 365 ? 'long' : undefined,
                  })
                }
                tickSizeOuter={0}
                domainLineProps={{
                  stroke: 'currentColor',
                  strokeOpacity: 0.1,
                  fill: 'none',
                }}
              />
              <ChartGrid
                orientation="horizontal"
                scaler={frequencyX}
                inlineStart={margin.top}
                inlineEnd={height - margin.bottom}
              />
              <ChartGrid
                orientation="vertical"
                scaler={frequencyY}
                inlineStart={margin.left}
                inlineEnd={width - margin.right}
              />
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  className="text-violet-1"
                  d={learningLine}
                  style={{ mixBlendMode: 'multiply' }}
                />
                <path
                  className="text-green-1"
                  d={newLine}
                  style={{ mixBlendMode: 'multiply' }}
                />
              </g>
            </svg>
          ) : (
            <div className="py-6 px-2 text-center flex flex-col items-center justify-center">
              <Body1>
                <Trans>
                  We don't have enough data to display in the supplied period.
                </Trans>
              </Body1>
              <Body2 className="mt-2">
                <Trans>Try selecting a broader interval above.</Trans>
              </Body2>
            </div>
          )}
        </div>
      </Card>
    </Container>
  )
}

export default StatisticsPage
