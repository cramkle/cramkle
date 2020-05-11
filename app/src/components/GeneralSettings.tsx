import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback, useState } from 'react'
import Cookies from 'universal-cookie'

import Button from './views/Button'
import { Listbox, ListboxOption } from './views/Listbox'

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
    <div className="pt-2 flex flex-col">
      {i18n._(t`Language`)}
      <Listbox value={currentLanguage} onChange={(e) => setCurrentLanguage(e)}>
        {OPTIONS.map((option) => (
          <ListboxOption key={option.locale} value={option.locale}>
            {i18n._(option.label)}
          </ListboxOption>
        ))}
      </Listbox>
      <Button className="mt-4 self-end" unelevated onClick={handleSave}>
        <Trans>Save</Trans>
      </Button>
    </div>
  )
}

export default GeneralSettings
