import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router'

import { notificationState } from '../../notification/index'
import registerSW from '../../registerSW'
import { positionMatchMinWidth } from '../../utils/popover'
import HeaderPortal from '../HeaderPortal'
import DecksIcon from '../icons/DecksIcon'
import MarketplaceIcon from '../icons/MarketplaceIcon'
import ModelsIcon from '../icons/ModelsIcon'
import StatisticsIcon from '../icons/StatisticsIcon'
import StudyIcon from '../icons/StudyIcon'
import Container from '../views/Container'
import { List, ListItem } from '../views/List'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Tooltip } from '../views/Tooltip'
import { Body1 } from '../views/Typography'
import DecksSection from './DecksSection'
import styles from './HomePage.css'
import ModelsSection from './ModelsSection'
import StudySection from './StudySection'

const HomeTab: React.FC<{
  Icon: React.ComponentType<React.SVGAttributes<SVGSVGElement>>
  label: string
}> = ({ Icon, label }) => {
  return (
    <Tooltip
      label={label}
      className="mt-2 text-center"
      position={positionMatchMinWidth}
    >
      <Tab className="min-h-full justify-center flex-1 md:flex-initial md:w-32">
        <Icon className="text-secondary h-6 w-6 md:h-8 md:w-8" />
      </Tab>
    </Tooltip>
  )
}

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

      <div
        className={classNames(
          styles.grid,
          'h-full grid gap-4 md:gap-6 xl:gap-8'
        )}
      >
        <aside
          className={classNames(
            styles.sidenav,
            'hidden md:block w-100 px-8 py-6 border-r border-gray-1'
          )}
        >
          <Body1 className="font-medium">
            <Trans>Sidebar</Trans>
          </Body1>

          <List className="py-4 -mx-3">
            <ListItem
              onClick={handleMarketplaceClick}
              icon={<MarketplaceIcon />}
            >
              {i18n._(t`Marketplace`)}
            </ListItem>
            <ListItem onClick={handleStatisticsClick} icon={<StatisticsIcon />}>
              {i18n._(t`Statistics`)}
            </ListItem>
          </List>
        </aside>

        <Container
          lean
          className={classNames(styles.content, 'mx-0 col-span-2')}
        >
          <Tabs index={index} onChange={handleTabChange}>
            <HeaderPortal>
              <TabList className="overflow-y-auto w-full md:w-auto h-full justify-around md:justify-center">
                <HomeTab Icon={StudyIcon} label={i18n._(t`Study`)} />
                <HomeTab Icon={DecksIcon} label={i18n._(t`Decks`)} />
                <HomeTab Icon={ModelsIcon} label={i18n._(t`Models`)} />
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
