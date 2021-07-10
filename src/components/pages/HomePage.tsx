import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import type { Location } from 'history'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router'

import registerSW from '../../registerSW'
import { pushSimpleToast, pushToast } from '../../toasts/pushToast'
import { ToastStore } from '../../toasts/store'
import { positionMatchMinWidth } from '../../utils/popover'
import { HeaderPortal } from '../HeaderPortal'
import { useCurrentUser } from '../UserContext'
import { DecksIcon } from '../icons/DecksIcon'
import { ModelsIcon } from '../icons/ModelsIcon'
import { StudyIcon } from '../icons/StudyIcon'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Tooltip } from '../views/Tooltip'
import DecksSection from './DecksSection'
import ModelsSection from './ModelsSection'
import StudySection from './StudySection'

const toastStore = ToastStore.getInstance()

const HomePageSidebar = React.lazy(() => import('../HomePageSidebar'))

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
      <Tab className="min-h-full !justify-center flex-1 md:flex-initial md:w-32">
        <Icon className="text-txt text-opacity-text-icon h-6 w-6 md:h-8 md:w-8" />
      </Tab>
    </Tooltip>
  )
}

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation() as Location<{ currentTab?: number }>
  const { i18n } = useLingui()

  const me = useCurrentUser()

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

  return (
    <>
      <Helmet>
        <title>{i18n._(t`Home`)}</title>
      </Helmet>

      <section className="flex h-full w-full mx-auto px-2 sm:px-6 md:px-8 xl:container">
        <HomePageSidebar className="hidden lg:block" />

        <section className="mx-4 md:mx-6 xl:mx-8 w-full">
          <Tabs index={index} onChange={handleTabChange}>
            <HeaderPortal>
              <TabList className="overflow-y-auto w-full md:w-auto h-full justify-around md:justify-center">
                <HomeTab Icon={StudyIcon} label={i18n._(t`Study`)} />
                <HomeTab Icon={DecksIcon} label={i18n._(t`Decks`)} />
                <HomeTab Icon={ModelsIcon} label={i18n._(t`Models`)} />
              </TabList>
            </HeaderPortal>
            <TabPanels>
              {me.anonymous && (
                <section className="mt-6 bg-yellow-1 bg-opacity-25 p-4 rounded">
                  <p className="text-txt text-opacity-text-primary">
                    <Trans>
                      You are using an{' '}
                      <span className="font-bold">anonymous account</span>, to
                      persist your study history and created decks and
                      flashcards, fill your profile info in the settings page.
                    </Trans>
                  </p>
                </section>
              )}

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
      </section>
    </>
  )
}

export default HomePage
