import { Trans } from '@lingui/macro'
import React from 'react'
import Container from 'views/Container'
import { Headline5 } from 'views/Typography'

import GeneralSettings from '../GeneralSettings'

const SettingsPage: React.FunctionComponent = () => {
  return (
    <Container>
      <Headline5>
        <Trans>Settings</Trans>
      </Headline5>
      <GeneralSettings />
    </Container>
  )
}

export default SettingsPage
