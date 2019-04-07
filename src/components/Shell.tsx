import React, { Suspense, useState, useEffect } from 'react'
import { graphql, ChildDataProps } from 'react-apollo'
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'
import LinearProgress from '@material/react-linear-progress'

import AppDrawer from './AppDrawer'
import NoSSR from './NoSSR'
import { useMobile } from './MobileContext'
import loadingQuery from '../graphql/topBarLoadingQuery.gql'

interface Data {
  topBar: {
    loading: boolean
  }
}

const Shell: React.FunctionComponent<ChildDataProps<{}, Data>> = ({
  children,
  data: {
    topBar: { loading },
  },
}) => {
  const isMobile = useMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

  const handleNavigationIconClick = () => {
    setDrawerOpen(isOpen => !isOpen)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

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
        render={children => (
          <>
            <TopAppBar className="absolute left-0 right-0" fixed dense>
              <TopAppBarRow>
                <TopAppBarSection align="start">
                  <TopAppBarIcon navIcon tabIndex={0}>
                    <MaterialIcon
                      icon="menu"
                      onClick={handleNavigationIconClick}
                    />
                  </TopAppBarIcon>
                  <TopAppBarTitle>Cramkle</TopAppBarTitle>
                </TopAppBarSection>
              </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust className="w-100 flex relative" dense>
              {children}
            </TopAppBarFixedAdjust>
          </>
        )}
      />
    </div>
  )
}

export default graphql<{}, Data>(loadingQuery)(Shell)
