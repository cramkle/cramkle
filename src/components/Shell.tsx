import LinearProgress from '@material/react-linear-progress'
import Icon from '@material/react-material-icon'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar'
import React, { Suspense, useCallback } from 'react'
import { compose, graphql, ChildDataProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import AppDrawer from './AppDrawer'
import NoSSR from './NoSSR'
import SearchBar from './SearchBar'
import { useMobile } from './MobileContext'
import useLocalStorage from '../hooks/useLocalStorage'
import logoUrl from '../assets/logo.svg'
import loadingQuery from '../graphql/topBarLoadingQuery.gql'

interface Data {
  topBar: {
    loading: boolean
  }
}

const Shell: React.FunctionComponent<
  ChildDataProps<RouteComponentProps, Data>
> = ({
  children,
  data: {
    topBar: { loading },
  },
  history,
}) => {
  const isMobile = useMobile()
  const [drawerOpen, setDrawerOpen] = useLocalStorage(
    'ck:drawerOpen',
    !isMobile,
    isMobile
  )

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
    <div className="h-100 overflow-auto w-100 relative">
      <NoSSR>
        <Suspense fallback={loader}>
          {loading && loader}
          {children}
        </Suspense>
      </NoSSR>
    </div>
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
                  <TopAppBarIcon navIcon tabIndex={0}>
                    <Icon icon="menu" onClick={handleNavigationIconClick} />
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
  graphql<{}, Data>(loadingQuery),
  withRouter
)(Shell)
