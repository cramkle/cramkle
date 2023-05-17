'use client'

import { Trans } from '@lingui/macro'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { NoSSR } from '@src/components/NoSSR'
import { Container } from '@src/components/views/Container'
import { Tab, TabList, TabPanels, Tabs } from '@src/components/views/Tabs'
import { Headline2 } from '@src/components/views/Typography'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const index = useMemo(() => {
    switch (pathname) {
      case '/settings/preferences':
        return 0
      case '/settings/profile':
        return 1
      default:
        return 0
    }
  }, [pathname])

  return (
    <>
      <Container className="py-4">
        <Headline2 className="text-txt text-opacity-text-primary font-medium">
          <Trans>Settings</Trans>
        </Headline2>
        <NoSSR>
          <Tabs className="mt-4" index={index}>
            <TabList>
              <Tab as={Link} href="/settings/preferences">
                General
              </Tab>
              <Tab as={Link} href="/settings/profile">
                Profile
              </Tab>
            </TabList>
            <TabPanels>{children}</TabPanels>
          </Tabs>
        </NoSSR>
      </Container>
    </>
  )
}
