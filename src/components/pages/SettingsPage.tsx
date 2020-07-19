import { Trans } from '@lingui/macro'
import React from 'react'

import GeneralSettings from '../GeneralSettings'
import Container from '../views/Container'
import { Headline2 } from '../views/Typography'

const SettingsPage: React.FunctionComponent = () => {
  return (
    <Container>
      <Headline2>
        <Trans>Account Settings</Trans>
      </Headline2>
      <GeneralSettings />
    </Container>
  )
}

export default SettingsPage
