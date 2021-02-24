import { Trans, t } from '@lingui/macro'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'

import GeneralSettings from '../GeneralSettings'
import ProfileSettings from '../ProfileSettings'
import { Container } from '../views/Container'
import { Headline2 } from '../views/Typography'

const SettingsPage: React.FC = () => {
  return (
    <>
      <Helmet title={t`Settings`} />
      <Container>
        <Headline2 className="text-txt text-opacity-text-primary font-bold">
          <Trans>Account Settings</Trans>
        </Headline2>
        <GeneralSettings />
        <ProfileSettings />
      </Container>
    </>
  )
}

export default SettingsPage
