import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router'

import { notificationState } from '../../notification/index'
import registerSW from '../../registerSW'
import HeaderPortal from '../HeaderPortal'
import DecksIcon from '../icons/DecksIcon'
import MarketplaceIcon from '../icons/MarketplaceIcon'
import ModelsIcon from '../icons/ModelsIcon'
import StatisticsIcon from '../icons/StatisticsIcon'
import StudyIcon from '../icons/StudyIcon'
import Container from '../views/Container'
import { List, ListItem } from '../views/List'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import DecksSection from './DecksSection'
import ModelsSection from './ModelsSection'
import StudySection from './StudySection'

const HomePage: React.FunctionComponent = () => {
  const history = useHistory()
  const location = useLocation<{ currentTab?: number }>()
  const { i18n } = useLingui()

  const [index, setIndex] = useState(location.state?.currentTab ?? 0)

  const prevTabRef = useRef(index)

  useEffect(() => {
    const stateIndex = location.state?.currentTab ?? 0

    if (prevTabRef.current !== stateIndex) {
      setIndex(stateIndex)
    }

    prevTabRef.current = stateIndex
  }, [location.state])

  useEffect(() => {
    let updateNotificationId: string | null = null
    let installNotificationId: string | null = null

    registerSW({
      onUpdate: () => {
        updateNotificationId = notificationState.addNotification({
          message: t`A new update is available!`,
          actionText: t`Refresh`,
          onAction: () => {
            window.location.reload()
          },
        })
      },
      onInstall: () => {
        installNotificationId = notificationState.addNotification({
          message: t`Ready to work offline`,
        })
      },
    })

    return () => {
      if (updateNotificationId) {
        notificationState.removeNotification(updateNotificationId)
      }

      if (installNotificationId) {
        notificationState.removeNotification(installNotificationId)
      }
    }
  }, [])

  const handleTabChange = useCallback(
    (index: number) => {
      history.push('/home', { currentTab: index })
    },
    [history]
  )

  const handleMarketplaceClick = useCallback(() => {
    history.push('/marketplace')
  }, [history])

  const handleStatisticsClick = useCallback(() => {
    history.push('/statistics')
  }, [history])

  return (
    <>
      <Helmet>
        <title>{i18n._(t`Home`)}</title>
      </Helmet>

      <div className="h-full flex">
        <List className="hidden md:block">
          <ListItem onClick={handleMarketplaceClick} icon={<MarketplaceIcon />}>
            {i18n._(t`Marketplace`)}
          </ListItem>
          <ListItem onClick={handleStatisticsClick} icon={<StatisticsIcon />}>
            {i18n._(t`Statistics`)}
          </ListItem>
        </List>

        <Container lean className="mr-auto md:mr-0 ml-auto md:ml-16 lg:ml-24">
          <Tabs index={index} onChange={handleTabChange}>
            <HeaderPortal>
              <TabList className="overflow-y-auto h-full justify-center">
                <Tab className="md:w-full min-h-full">
                  <StudyIcon />
                  <span className="hidden md:inline-block ml-4">
                    <Trans>Study</Trans>
                  </span>
                </Tab>
                <Tab className="md:w-full min-h-full">
                  <DecksIcon />
                  <span className="hidden md:inline-block ml-4">
                    <Trans>Decks</Trans>
                  </span>
                </Tab>
                <Tab className="md:w-full min-h-full">
                  <ModelsIcon />
                  <span className="hidden md:inline-block ml-4">
                    <Trans>Models</Trans>
                  </span>
                </Tab>
              </TabList>
            </HeaderPortal>
            <TabPanels>
              <TabPanel>
                <StudySection />
              </TabPanel>
              <TabPanel>
                <DecksSection />
              </TabPanel>
              <TabPanel>
                <ModelsSection />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </div>
    </>
  )
}

export default HomePage
