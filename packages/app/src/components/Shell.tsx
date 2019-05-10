import { t } from '@lingui/macro'
import { withI18n, withI18nProps } from '@lingui/react'
import LinearProgress from '@material/react-linear-progress'
import Icon from '@material/react-material-icon'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar'
import React, { Suspense, useCallback, useEffect, useRef } from 'react'
import { compose, graphql, ChildDataProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import AppDrawer from './AppDrawer'
import NoSSR from './NoSSR'
import SearchBar from './SearchBar'
import { useHints } from './HintsContext'
import useLocalStorage from '../hooks/useLocalStorage'
import logoUrl from '../assets/logo.svg'
import loadingQuery from '../graphql/topBarLoadingQuery.gql'
import { TopBarLoadingQuery } from '../graphql/__generated__/TopBarLoadingQuery'

type Props = ChildDataProps<
  RouteComponentProps & withI18nProps,
  TopBarLoadingQuery
>

const Shell: React.FunctionComponent<Props> = ({
  children,
  data: {
    topBar: { loading },
  },
  history,
  location: { pathname },
  i18n,
}) => {
  const { isMobile } = useHints()
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
      <NoSSR>
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
        render={(children: JSX.Element) => (
          <>
            <TopAppBar className="absolute left-0 right-0" fixed>
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
                    />
                  </TopAppBarIcon>
                  <TopAppBarTitle
                    className="flex items-center pl1 link color-inherit"
                    tag="a"
                    href="/home"
                    onClick={handleLogoClick}
                  >
                    <img
                      className="pr2"
                      width="40"
                      src={logoUrl}
                      alt="Cramkle"
                    />
                    Cramkle
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

export default compose(
  graphql<{}, TopBarLoadingQuery>(loadingQuery),
  withRouter,
  withI18n()
)(Shell)
