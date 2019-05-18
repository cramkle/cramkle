import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from '@material/react-button'
import Select, { Option } from '@material/react-select'
import React, { useState, useCallback } from 'react'
import Cookies from 'universal-cookie'

import useOffline from '../hooks/useOffline'

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

const GeneralSettings: React.FunctionComponent = () => {
  const i18n = useLingui()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
  const offline = useOffline()

  const handleSave = useCallback(() => {
    i18n.activate(currentLanguage)

    const cookies = new Cookies()
    cookies.set('language', currentLanguage)

    if (!offline) {
      window.location.reload()
    }
  }, [currentLanguage, i18n, offline])

  return (
    <div className="pt2 flex flex-column">
      <Select
        label={i18n._(t`Language`)}
        value={currentLanguage}
        onChange={e =>
          setCurrentLanguage((e.target as HTMLSelectElement).value)
        }
      >
        {OPTIONS.map(option => (
          <Option key={option.locale} value={option.locale}>
            {i18n._(option.label)}
          </Option>
        ))}
      </Select>
      <Button
        className="mt3 self-end"
        unelevated
        onClick={handleSave}
        disabled={offline}
      >
        <Trans>Save</Trans>
      </Button>
    </div>
  )
}

export default GeneralSettings
