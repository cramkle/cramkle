import { useMutation } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { positionRight } from '@reach/popover'
import classNames from 'classnames'
import gql from 'graphql-tag'
import { useState } from 'react'
import * as React from 'react'
import { FixedSizeList as WindowList } from 'react-window'
import Cookies from 'universal-cookie'

import SettingItem from '../components/SettingItem'
import { useCurrentUser } from '../components/UserContext'
import { Button } from '../components/views/Button'
import { Card, CardContent } from '../components/views/Card'
import { Chip } from '../components/views/Chip'
import { CircularProgress } from '../components/views/CircularProgress'
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from '../components/views/Listbox'
import { useOffline } from '../hooks/useOffline'
import { useTimezoneData } from '../hooks/useTimezoneData'
import type { TimezoneEntry } from '../hooks/useTimezoneData'
import { pushSimpleToast } from '../toasts/pushToast'
import styles from './GeneralSettings.css'
import type {
  UpdatePreferences,
  UpdatePreferencesVariables,
} from './__generated__/UpdatePreferences'

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
  mutation UpdatePreferences($timeZone: String, $locale: String) {
    updatePreferences(input: { zoneInfo: $timeZone, locale: $locale }) {
      user {
        id
        preferences {
          zoneInfo
          locale
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
  const me = useCurrentUser()
  const zoneInfo = me.preferences.zoneInfo
  const [updatePreferences, { loading }] = useMutation<
    UpdatePreferences,
    UpdatePreferencesVariables
  >(UPDATE_PREFERENCES_MUTATION)
  const [timeZone, setTimeZone] = useState(zoneInfo)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale)
  const timezoneData = useTimezoneData()

  const handleChangeLanguage = (language: string) => {
    setCurrentLanguage(language)
  }

  const handleSave = () => {
    updatePreferences({
      variables: { timeZone, locale: currentLanguage },
    }).then((mutationResult) => {
      const cookies = new Cookies()
      cookies.set('language', currentLanguage)

      if (mutationResult.errors) {
        pushSimpleToast(t`An unexpected error has occurred`)
        return
      }

      pushSimpleToast(t`Preferences updated successfully`)

      if (currentLanguage !== i18n.locale) {
        window.location.reload()
      }
    })
  }

  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col">
        <SettingItem
          id="user-language"
          title={<Trans>Language</Trans>}
          description={
            <Trans>
              Update your preferred language for headlines, buttons and other
              texts.
            </Trans>
          }
        >
          <ListboxInput
            id="user-language"
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
        </SettingItem>
        <SettingItem
          className="mt-4"
          id="user-timezone"
          title={<Trans>Time zone</Trans>}
          description={
            <Trans>
              Used to compute the statistics and study schedule in your local
              time.
            </Trans>
          }
        >
          {timezoneData.loading ? (
            <CircularProgress />
          ) : (
            <ListboxInput
              id="user-timezone"
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
        </SettingItem>
      </CardContent>
      <div className="p-4 flex border-t border-divider border-opacity-divider">
        <Button
          variation="primary"
          className="ml-auto"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : <Trans>Save preferences</Trans>}
        </Button>
      </div>
    </Card>
  )
}

export default GeneralSettings
