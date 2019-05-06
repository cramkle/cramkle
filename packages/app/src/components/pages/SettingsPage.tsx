import { Trans } from '@lingui/macro'
import { Headline5 } from '@material/react-typography'
import React from 'react'

import GeneralSettings from '../GeneralSettings'
import Container from '../views/Container'

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
