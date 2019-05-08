import { Trans, t } from '@lingui/macro'
import { withI18n, withI18nProps } from '@lingui/react'
import Button from '@material/react-button'
import Select, { Option } from '@material/react-select'
import React, { useState, useCallback } from 'react'
import Cookies from 'universal-cookie'

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

const GeneralSettings: React.FunctionComponent<withI18nProps> = ({ i18n }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  const handleSave = useCallback(() => {
    i18n.activate(currentLanguage)

    const cookies = new Cookies()
    cookies.set('language', currentLanguage)

    window.location.reload()
  }, [currentLanguage, i18n])

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
      <Button className="mt3 self-end" unelevated onClick={handleSave}>
        <Trans>Save</Trans>
      </Button>
    </div>
  )
}

export default withI18n()(GeneralSettings)
