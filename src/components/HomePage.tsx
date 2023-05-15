'use client'

import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import * as React from 'react'

import registerSW from '../registerSW'
import { pushSimpleToast, pushToast } from '../toasts/pushToast'
import { ToastStore } from '../toasts/store'
import { positionMatchMinWidth } from '../utils/popover'
import { HeaderPortal } from './HeaderPortal'
import { useCurrentUser } from './UserContext'
import { DecksIcon } from './icons/DecksIcon'
import { ModelsIcon } from './icons/ModelsIcon'
import { StudyIcon } from './icons/StudyIcon'
import { Tab, TabList, TabPanels, Tabs } from './views/Tabs'
import { Tooltip } from './views/Tooltip'

const toastStore = ToastStore.getInstance()

const HomePageSidebar = React.lazy(() => import('./HomePageSidebar'))

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

const HomePage: React.FunctionComponent = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useLingui()

  const me = useCurrentUser()

  let index: number

  switch (pathname) {
    case '/': {
      index = 0
      break
    }
    case '/decks': {
      index = 1
      break
    }
    case '/models': {
      index = 2
      break
    }
    default: {
      throw new Error(`Unexpected path ${JSON.stringify(pathname)}`)
    }
  }

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
      let path: string

      switch (index) {
        case 0: {
          path = '/'
          break
        }
        case 1: {
          path = '/decks'
          break
        }
        case 2: {
          path = '/models'
          break
        }
        default: {
          throw new Error('Unexpected index ' + index)
        }
      }

      router.push(path)
    },
    [router]
  )

  return (
    <>
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

              {children}
            </TabPanels>
          </Tabs>
        </section>
      </section>
    </>
  )
}

export default HomePage
