import { Trans, t } from '@lingui/macro'
import type { VFC } from 'react'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet, useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { NoSSR } from '../NoSSR'
import { Container } from '../views/Container'
import { Tab, TabList, TabPanels, Tabs } from '../views/Tabs'
import { Headline2 } from '../views/Typography'

const SettingsPage: VFC = () => {
  const location = useLocation()

  const index = useMemo(() => {
    switch (location.pathname) {
      case '/settings':
        return 0
      case '/settings/profile':
        return 1
      default:
        return 0
    }
  }, [location])

  return (
    <>
      <Helmet title={t`Settings`} />
      <Container className="py-4">
        <Headline2 className="text-txt text-opacity-text-primary font-medium">
          <Trans>Settings</Trans>
        </Headline2>
        <NoSSR>
          <Tabs className="mt-4" index={index}>
            <TabList>
              <Tab as={Link} to="">
                General
              </Tab>
              <Tab as={Link} to="profile">
                Profile
              </Tab>
            </TabList>
            <TabPanels>
              <Outlet />
            </TabPanels>
          </Tabs>
        </NoSSR>
      </Container>
    </>
  )
}

export default SettingsPage
