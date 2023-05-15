import { Trans, t } from '@lingui/macro'
import Link from 'next/link'
import type { VFC } from 'react'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet, useLocation } from 'react-router'

import { NoSSR } from '../components/NoSSR'
import { Container } from '../components/views/Container'
import { Tab, TabList, TabPanels, Tabs } from '../components/views/Tabs'
import { Headline2 } from '../components/views/Typography'

const SettingsPage: VFC = () => {
  const location = useLocation()

  const index = useMemo(() => {
    switch (location.pathname) {
      case '/settings/preferences':
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
              <Tab as={Link} to="preferences">
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
