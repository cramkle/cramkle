import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router'

import { notificationState } from '../../notification/index'
import registerSW from '../../registerSW'
import Icon from '../views/Icon'
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

  return (
    <>
      <Helmet>
        <title>{i18n._(t`Home`)}</title>
      </Helmet>

      <div className="h-100 flex flex-column">
        <Tabs index={index} onChange={handleTabChange}>
          <TabList>
            <Tab className="w-100">
              <Icon
                className="mdc-tab__icon mr3"
                icon="school"
                aria-hidden="true"
              />
              <Trans>Study</Trans>
            </Tab>
            <Tab className="w-100">
              <Icon
                className="mdc-tab__icon mr3"
                icon="style"
                aria-hidden="true"
              />
              <Trans>Decks</Trans>
            </Tab>
            <Tab className="w-100">
              <Icon
                className="mdc-tab__icon mr3"
                icon="flip_to_back"
                aria-hidden="true"
              />
              <Trans>Models</Trans>
            </Tab>
          </TabList>
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
      </div>
    </>
  )
}

export default HomePage
