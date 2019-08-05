import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps, withRouter } from 'react-router'

import StudySection from './StudySection'
import DecksSection from './DecksSection'
import ModelsSection from './ModelsSection'
import Icon from '../views/Icon'
import registerSW from '../../registerSW'
import { notificationState } from '../../notification/index'

const HomePage: React.FunctionComponent<RouteComponentProps> = ({
  history,
  location,
}) => {
  const { i18n } = useLingui()

  const [index, setIndex] = useState(
    (location.state && location.state.currentTab) || 0
  )

  const prevTabRef = useRef(index)

  useEffect(() => {
    const stateIndex = (location.state && location.state.currentTab) || 0

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

  const handleActiveIndexUpdate = (index: number) => {
    history.push('/home', { currentTab: index })
  }

  return (
    <>
      <Helmet>
        <title>{i18n._(t`Home`)}</title>
      </Helmet>

      <div className="h-100 flex flex-column">
        <TabBar
          activeIndex={index}
          handleActiveIndexUpdate={handleActiveIndexUpdate}
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

export default withRouter(HomePage)
