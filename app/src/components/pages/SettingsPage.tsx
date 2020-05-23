import { Trans } from '@lingui/macro'
import React from 'react'

import GeneralSettings from '../GeneralSettings'
import Container from '../views/Container'
import { Headline1 } from '../views/Typography'

const SettingsPage: React.FunctionComponent = () => {
  return (
    <Container>
      <Headline1>
        <Trans>Settings</Trans>
      </Headline1>
      <GeneralSettings />
    </Container>
  )
}

export default SettingsPage
