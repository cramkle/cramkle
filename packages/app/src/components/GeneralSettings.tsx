import { t } from '@lingui/macro'
import { withI18n, withI18nProps } from '@lingui/react'
import Select, { Option } from '@material/react-select'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

const GeneralSettings: React.FunctionComponent<withI18nProps> = ({ i18n }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  useEffect(() => {
    i18n.activate(currentLanguage)
    const cookies = new Cookies()

    cookies.set('language', currentLanguage)
  }, [i18n, currentLanguage])

  return (
    <div className="pt2 flex flex-column">
      <Select
        label={i18n._(t`Language`)}
        value={currentLanguage}
        onChange={e =>
          setCurrentLanguage((e.target as HTMLSelectElement).value)
        }
      >
        <Option value="en">English</Option>
        <Option value="pt">Português</Option>
      </Select>
    </div>
  )
}

export default withI18n()(GeneralSettings)
