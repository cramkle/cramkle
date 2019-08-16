import { useQuery } from '@apollo/react-hooks'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import LinearProgress from '@material/react-linear-progress'
import gql from 'graphql-tag'
import React, { Suspense, useCallback, useEffect, useRef } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Icon from 'views/Icon'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from 'views/TopAppBar'
import useLocalStorage from 'hooks/useLocalStorage'
import useOffline from 'hooks/useOffline'
import { ReactComponent as Logo } from 'assets/logo.svg'
import { ReactComponent as LogoGray } from 'assets/logo-gray.svg'
import AppDrawer from './AppDrawer'
import NoSSR from './NoSSR'
import SearchBar from './SearchBar'
import { useHints } from './HintsContext'
import { TopBarLoadingQuery } from './__generated__/TopBarLoadingQuery'

type Props = RouteComponentProps

const TOP_BAR_LOADING_QUERY = gql`
  query TopBarLoadingQuery {
    topBar @client {
      loading
    }
  }
`

const Shell: React.FunctionComponent<Props> = ({
  children,
  history,
  location: { pathname },
}) => {
  const {
    data: { topBar },
  } = useQuery<TopBarLoadingQuery>(TOP_BAR_LOADING_QUERY)

  const loading = topBar && topBar.loading

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
    e => {
      e.preventDefault()
      history.push('/home')
    },
    [history]
  )

  const handleNavigationIconClick = useCallback(() => {
    setDrawerOpen(isOpen => !isOpen)
  }, [setDrawerOpen])

  const handleNavigationIconKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        setDrawerOpen(isOpen => !isOpen)
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
      className="absolute top-0 left-0 right-0 z-2"
      indeterminate
    />
  )

  let content = (
    <main className="h-100 overflow-auto w-100 relative">
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
    <div className="vh-100 flex">
      <AppDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        content={content}
        render={children => (
          <>
            <TopAppBar fixed>
              <TopAppBarRow>
                <TopAppBarSection align="start">
                  <TopAppBarIcon navIcon>
                    <Icon
                      icon="menu"
                      tabIndex={0}
                      role="button"
                      aria-label={i18n._(t`Main menu`)}
                      aria-expanded={drawerOpen}
                      onClick={handleNavigationIconClick}
                      onKeyDown={handleNavigationIconKeyDown}
                      rippled
                    />
                  </TopAppBarIcon>
                  <TopAppBarTitle
                    className="flex items-center pl1 link color-inherit"
                    tag="a"
                    href="/home"
                    onClick={handleLogoClick}
                  >
                    {!isOffline ? <Logo width="32" /> : <LogoGray width="32" />}
                    <span className="ml2">Cramkle</span>
                  </TopAppBarTitle>

                  {!isMobile && <SearchBar />}
                </TopAppBarSection>
              </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust className="w-100 flex relative">
              {children}
            </TopAppBarFixedAdjust>
          </>
        )}
      />
    </div>
  )
}

export default withRouter(Shell)
