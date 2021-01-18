import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { Location } from 'history'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import registerSW from '../../registerSW'
import { pushSimpleToast, pushToast } from '../../toasts/pushToast'
import ToastStore from '../../toasts/store'
import { positionMatchMinWidth } from '../../utils/popover'
import HeaderPortal from '../HeaderPortal'
import NoSSR from '../NoSSR'
import CircleIcon from '../icons/CircleIcon'
import DecksIcon from '../icons/DecksIcon'
import MarketplaceIcon from '../icons/MarketplaceIcon'
import ModelsIcon from '../icons/ModelsIcon'
import StatisticsIcon from '../icons/StatisticsIcon'
import StudyIcon from '../icons/StudyIcon'
import { Chip } from '../views/Chip'
import { List, ListItem } from '../views/List'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Tooltip } from '../views/Tooltip'
import { Body1 } from '../views/Typography'
import DecksSection from './DecksSection'
import styles from './HomePage.css'
import ModelsSection from './ModelsSection'
import StudySection from './StudySection'

const toastStore = ToastStore.getInstance()

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
        <Icon className="text-txt text-opacity-text-icon h-6 w-6 md:h-8 md:w-8" />
      </Tab>
    </Tooltip>
  )
}

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation() as Location<{ currentTab?: number }>
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
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    let updateNotificationId: string | null = null
    let installNotificationId: string | null = null

    registerSW({
      onUpdate: () => {
        updateNotificationId = pushToast({
          message: t`A new update is available!`,
          action: {
            label: t`Refresh`,
            onPress: () => {
              window.location.reload()
            },
          },
        })
      },
      onInstall: () => {
        installNotificationId = pushSimpleToast(t`Ready to work offline`)
      },
    })

    return () => {
      if (updateNotificationId) {
        toastStore.remove(updateNotificationId)
      }

      if (installNotificationId) {
        toastStore.remove(installNotificationId)
      }
    }
  }, [])

  const handleTabChange = useCallback(
    (index: number) => {
      navigate('/home', { state: { currentTab: index } })
    },
    [navigate]
  )

  const handleStatisticsClick = useCallback(() => {
    navigate('/statistics')
  }, [navigate])

  return (
    <>
      <Helmet>
        <title>{i18n._(t`Home`)}</title>
      </Helmet>

      <NoSSR>
        <div
          className={classNames(
            styles.grid,
            'h-full grid gap-4 md:gap-6 xl:gap-8'
          )}
        >
          <nav
            className={classNames(
              styles.sidenav,
              'hidden md:block w-100 px-8 py-6 border-r border-divider border-opacity-divider'
            )}
          >
            <Body1 className="font-medium text-txt text-opacity-text-primary">
              <Trans>Sidebar</Trans>
            </Body1>

            <List className="py-4 -mx-3">
              <ListItem
                onClick={handleStatisticsClick}
                icon={<StatisticsIcon />}
              >
                <Trans>Statistics</Trans>
              </ListItem>
              <ListItem onClick={() => {}} icon={<MarketplaceIcon />} disabled>
                <div className="flex items-center">
                  <Trans>Marketplace</Trans>

                  <Chip size="small" color="primary" className="ml-auto">
                    <Trans>soon</Trans>
                  </Chip>
                </div>
              </ListItem>
            </List>

            <footer className="mt-4 flex justify-between items-center text-txt text-opacity-text-secondary text-xs">
              <Link to="/about">
                <Trans>About us</Trans>
              </Link>

              <CircleIcon />

              <a
                href="https://www.patreon.com/lucasecdb"
                target="_blank"
                rel="noreferrer"
              >
                Patreon
              </a>

              <CircleIcon />

              <a
                href="https://github.com/cramkle/cramkle"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </footer>
          </nav>

          <section
            className={classNames(
              styles.content,
              'mx-4 md:ml-0 md:mr-6 xl:mr-8 col-span-2'
            )}
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
          </section>
        </div>
      </NoSSR>
    </>
  )
}

export default HomePage
