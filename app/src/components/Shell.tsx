import { useQuery } from '@apollo/react-hooks'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import LinearProgress from '@material/react-linear-progress'
import gql from 'graphql-tag'
import React, { Suspense, useCallback, useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router'

import { ReactComponent as LogoGray } from '../assets/logo-gray.svg'
import { ReactComponent as Logo } from '../assets/logo.svg'
import useLocalStorage from '../hooks/useLocalStorage'
import useOffline from '../hooks/useOffline'
import AppDrawer from './AppDrawer'
import { useHints } from './HintsContext'
import NoSSR from './NoSSR'
import { TopBarLoadingQuery } from './__generated__/TopBarLoadingQuery'
import Icon from './views/Icon'
import IconButton from './views/IconButton'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from './views/TopAppBar'

const TOP_BAR_LOADING_QUERY = gql`
  query TopBarLoadingQuery {
    topBar @client {
      loading
    }
  }
`

const Shell: React.FunctionComponent = ({ children }) => {
  const history = useHistory()
  const { pathname } = useLocation()
  const { data } = useQuery<TopBarLoadingQuery>(TOP_BAR_LOADING_QUERY)

  const topBar = data?.topBar
  const loading = topBar?.loading

  const { i18n } = useLingui()
  const { isMobile } = useHints()
  const isOffline = useOffline()
  const [drawerOpen, setDrawerOpen] = useLocalStorage(
    'ck:drawerOpen',
    !isMobile,
    isMobile
  )

  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (isMobile && drawerOpen && prevPathname.current !== pathname) {
      setDrawerOpen(false)
    }

    prevPathname.current = pathname
  }, [drawerOpen, isMobile, pathname, setDrawerOpen])

  const handleLogoClick = useCallback(
    (e) => {
      e.preventDefault()
      history.push('/home')
    },
    [history]
  )

  const handleNavigationIconClick = useCallback(() => {
    setDrawerOpen((isOpen) => !isOpen)
  }, [setDrawerOpen])

  const handleNavigationIconKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        setDrawerOpen((isOpen) => !isOpen)
      }
    },
    [setDrawerOpen]
  )

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
  }, [setDrawerOpen])

  if (React.Children.count(children) === 0) {
    return null
  }

  const loader = (
    <LinearProgress
      className="absolute top-0 left-0 right-0 z-20"
      indeterminate
    />
  )

  const content = (
    <main className="h-full overflow-auto w-full relative">
      <NoSSR fallback={loader}>
        <Suspense fallback={loader}>
          {loading && loader}
          {children}
          <div id="portal-anchor" />
        </Suspense>
      </NoSSR>
    </main>
  )

  return (
    <div className="h-screen flex">
      <AppDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        content={content}
        render={(children) => (
          <>
            <TopAppBar fixed>
              <TopAppBarRow>
                <TopAppBarSection align="start">
                  <TopAppBarIcon navIcon>
                    <IconButton
                      tabIndex={0}
                      role="button"
                      aria-label={i18n._(t`Main menu`)}
                      aria-expanded={drawerOpen}
                      onClick={handleNavigationIconClick}
                      onKeyDown={handleNavigationIconKeyDown}
                    >
                      <Icon icon="menu" />
                    </IconButton>
                  </TopAppBarIcon>
                  <TopAppBarTitle
                    className="flex items-center pl-1 link color-inherit"
                    tag="a"
                    href="/home"
                    onClick={handleLogoClick}
                  >
                    {!isOffline ? <Logo width="32" /> : <LogoGray width="32" />}
                    <span className="ml-2">Cramkle</span>
                  </TopAppBarTitle>
                </TopAppBarSection>
              </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust className="w-full flex relative">
              {children}
            </TopAppBarFixedAdjust>
          </>
        )}
      />
    </div>
  )
}

export default Shell
