import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { positionRight } from '@reach/popover'
import classNames from 'classnames'
import gql from 'graphql-tag'
import { useState } from 'react'
import * as React from 'react'
import { FixedSizeList as WindowList } from 'react-window'
import Cookies from 'universal-cookie'

import useOffline from '../hooks/useOffline'
import { TimezoneEntry, useTimezoneData } from '../hooks/useTimezoneData'
import styles from './GeneralSettings.css'
import {
  UpdatePreferences,
  UpdatePreferencesVariables,
} from './__generated__/UpdatePreferences'
import { UserQuery } from './__generated__/UserQuery'
import USER_QUERY from './userQuery.gql'
import Button from './views/Button'
import { Card, CardContent } from './views/Card'
import { Chip } from './views/Chip'
import CircularProgress from './views/CircularProgress'
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from './views/Listbox'
import { Headline2, Subtitle2 } from './views/Typography'

const OPTIONS = [
  {
    locale: 'en',
    label: t`English`,
  },
  {
    locale: 'pt',
    label: t`Portuguese`,
  },
]

const UPDATE_PREFERENCES_MUTATION = gql`
  mutation UpdatePreferences($timeZone: String) {
    updatePreferences(input: { zoneInfo: $timeZone }) {
      user {
        id
        preferences {
          zoneInfo
        }
      }
    }
  }
`

const TimezoneOption: React.FC<{
  data: TimezoneEntry[]
  index: number
  style: React.CSSProperties
}> = ({ data, index, style }) => {
  const { name, timezoneOffset } = data[index]
  const hour = Math.floor(Math.abs(timezoneOffset) / 60)
  const minutes = Math.abs(timezoneOffset) - hour * 60

  const sign = timezoneOffset > 0 ? '-' : '+'

  const formattedHour = (hour + '').padStart(2, '0')
  const formattedMinutes = (minutes + '').padStart(2, '0')

  const formattedOffset = `${sign}${formattedHour}:${formattedMinutes}`

  return (
    <ListboxOption
      key={name}
      style={{ ...style, width: 'calc(100% - 1rem)' }}
      value={name}
    >
      <div className="w-full flex items-center justify-between">
        <span className="truncate">{name}</span>
        <Chip className="ml-2 flex-shrink-0" color="primary" size="small">
          <span className="font-mono">{formattedOffset}</span>
        </Chip>
      </div>
    </ListboxOption>
  )
}

const GeneralSettings: React.FC = () => {
  const { i18n } = useLingui()
  const { data } = useQuery<UserQuery>(USER_QUERY)
  const zoneInfo = data!.me!.preferences.zoneInfo
  const [updatePreferences, { loading }] = useMutation<
    UpdatePreferences,
    UpdatePreferencesVariables
  >(UPDATE_PREFERENCES_MUTATION)
  const [timeZone, setTimeZone] = useState(zoneInfo)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale)
  const timezoneData = useTimezoneData()

  const handleChangeLanguage = (language: string) => {
    setCurrentLanguage(language)
    i18n.activate(language)

    const cookies = new Cookies()
    cookies.set('language', language)
    window.location.reload()
  }

  const handleSave = () => {
    updatePreferences({ variables: { timeZone } })
  }

  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col">
        <Headline2>
          <Trans>Preferences</Trans>
        </Headline2>
        <div
          className={classNames(
            styles.settingItem,
            'mt-4 grid items-center sm:items-start'
          )}
        >
          <label htmlFor="user-language" className="flex flex-col">
            <span>
              <Trans>Language</Trans>
            </span>
          </label>
          <Subtitle2
            className={classNames(
              styles.settingDescription,
              'mt-2 sm:mt-1 text-secondary'
            )}
          >
            <Trans>
              This configuration applies to this browser only, and won't be
              synchronized across your devices.
            </Trans>
          </Subtitle2>
          <ListboxInput
            id="user-language"
            className={classNames(styles.settingInput, 'ml-2')}
            value={currentLanguage}
            onChange={handleChangeLanguage}
            disabled={useOffline()}
          >
            <ListboxButton />
            <ListboxPopover position={positionRight}>
              <ListboxList>
                {OPTIONS.map((option) => (
                  <ListboxOption key={option.locale} value={option.locale}>
                    {i18n._(option.label)}
                  </ListboxOption>
                ))}
              </ListboxList>
            </ListboxPopover>
          </ListboxInput>
        </div>
        <div
          className={classNames(
            styles.settingItem,
            'mt-4 grid items-center sm:items-start'
          )}
        >
          <label htmlFor="user-timezone">
            <Trans>Time zone</Trans>
          </label>
          <Subtitle2
            className={classNames(
              styles.settingDescription,
              'mt-2 sm:mt-1 text-secondary w-full'
            )}
          >
            <Trans>
              Used to compute the statistics and study schedule in your local
              time.
            </Trans>
          </Subtitle2>
          {timezoneData.loading ? (
            <CircularProgress
              className={classNames(styles.settingInput, 'self-center mx-4')}
            />
          ) : (
            <ListboxInput
              id="user-timezone"
              className={classNames(styles.settingInput, 'ml-2')}
              value={timeZone}
              onChange={setTimeZone}
              disabled={loading}
            >
              <ListboxButton>
                {({ value }) => (
                  <span
                    className={classNames(styles.timezoneLabel, 'truncate')}
                  >
                    {value}
                  </span>
                )}
              </ListboxButton>
              <ListboxPopover
                className="h-64"
                position={(targetRect, popoverRect) => {
                  const { left, ...position } = positionRight(
                    targetRect,
                    popoverRect
                  )

                  const leftPosition = parseInt(
                    (left as string).slice(0, -2),
                    10
                  )

                  return {
                    ...position,
                    left: `${Math.max(2, leftPosition)}px`,
                  }
                }}
              >
                <ListboxList>
                  <WindowList
                    className="-my-2 rounded"
                    height={256}
                    width={300}
                    itemCount={timezoneData.timezones.length}
                    itemSize={40}
                    itemData={timezoneData.timezones}
                  >
                    {TimezoneOption}
                  </WindowList>
                </ListboxList>
              </ListboxPopover>
            </ListboxInput>
          )}
        </div>
        <Button
          variation="primary"
          className="mt-4 ml-auto"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <Trans>Save</Trans>}
        </Button>
      </CardContent>
    </Card>
  )
}

export default GeneralSettings
