import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Listbox, ListboxOption } from '@reach/listbox'
import React, { useCallback, useState } from 'react'
import Cookies from 'universal-cookie'

import Button from './views/Button'

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
  const { i18n } = useLingui()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale)

  const handleSave = useCallback(() => {
    i18n.activate(currentLanguage)

    const cookies = new Cookies()
    cookies.set('language', currentLanguage)
  }, [currentLanguage, i18n])

  return (
    <div className="pt2 flex flex-column">
      {i18n._(t`Language`)}
      <Listbox value={currentLanguage} onChange={(e) => setCurrentLanguage(e)}>
        {OPTIONS.map((option) => (
          <ListboxOption key={option.locale} value={option.locale}>
            {i18n._(option.label)}
          </ListboxOption>
        ))}
      </Listbox>
      <Button className="mt3 self-end" unelevated onClick={handleSave}>
        <Trans>Save</Trans>
      </Button>
    </div>
  )
}

export default GeneralSettings
