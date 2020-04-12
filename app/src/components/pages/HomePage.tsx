import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router'

import StudySection from './StudySection'
import DecksSection from './DecksSection'
import ModelsSection from './ModelsSection'
import Icon from 'views/Icon'
import Tab from 'views/Tab'
import TabBar from 'views/TabBar'
import registerSW from '../../registerSW'
import { notificationState } from 'notification/index'

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

  const handleActiveIndexUpdate = useCallback(
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
        <TabBar
          activeIndex={index}
          onActiveIndexUpdate={handleActiveIndexUpdate}
        >
          <Tab>
            <Icon
              className="mdc-tab__icon mr3"
              icon="school"
              aria-hidden="true"
            />
            <Trans>Study</Trans>
          </Tab>
          <Tab>
            <Icon
              className="mdc-tab__icon mr3"
              icon="style"
              aria-hidden="true"
            />
            <Trans>Decks</Trans>
          </Tab>
          <Tab>
            <Icon
              className="mdc-tab__icon mr3"
              icon="flip_to_back"
              aria-hidden="true"
            />
            <Trans>Models</Trans>
          </Tab>
        </TabBar>

        {index === 0 && <StudySection />}
        {index === 1 && <DecksSection />}
        {index === 2 && <ModelsSection />}
      </div>
    </>
  )
}

export default HomePage
