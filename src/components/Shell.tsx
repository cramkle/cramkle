import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
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
import Drawer, { DrawerContent, DrawerAppContent } from '@material/react-drawer'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@material/react-list'

import useWindowSize from '../hooks/useWindowSize'
import { useMobile } from '../hooks/useMobile'
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
  history,
  data: {
    topBar: { loading },
  },
}) => {
  const isMobile = useMobile()
  const { height: windowHeight } = useWindowSize()

  const drawerRef = useRef<HTMLElement>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

  useLayoutEffect(() => {
    if (isMobile || drawerRef.current === null) {
      return
    }

    drawerRef.current.style.height = `${windowHeight - 64}px`
  }, [isMobile, windowHeight])

  const handleLogout = () => {
    fetch('/_c/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => window.location.assign('/login'))
  }

  const handleNavigationIconClick = () => {
    setDrawerOpen(isOpen => !isOpen)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  if (React.Children.count(children) === 0) {
    return null
  }

  const drawerItems = (
    <List>
      <ListItem tabIndex={0} onClick={() => history.push('/')}>
        <ListItemGraphic graphic={<MaterialIcon icon="home" />} />
        <ListItemText primaryText="Home" />
      </ListItem>
      <ListItem onClick={() => history.push('/marketplace')}>
        <ListItemGraphic
          graphic={<MaterialIcon icon="store_mall_directory" />}
        />
        <ListItemText primaryText="Marketplace" />
      </ListItem>
      <ListItem onClick={() => history.push('/statistics')}>
        <ListItemGraphic graphic={<MaterialIcon icon="bar_chart" />} />
        <ListItemText primaryText="Statistics" />
      </ListItem>
      <ListItem onClick={() => history.push('/settings')}>
        <ListItemGraphic graphic={<MaterialIcon icon="settings" />} />
        <ListItemText primaryText="Settings" />
      </ListItem>
      <ListItem onClick={handleLogout}>
        <ListItemGraphic graphic={<MaterialIcon icon="exit_to_app" />} />
        <ListItemText primaryText="Logout" />
      </ListItem>
    </List>
  )

  let content = (
    <div className="h-100 overflow-auto w-100">
      {loading && <LinearProgress indeterminate />}
      {children}
    </div>
  )

  if (!isMobile) {
    content = (
      <>
        <Drawer open={drawerOpen} dismissible innerRef={drawerRef}>
          <DrawerContent>{drawerItems}</DrawerContent>
        </Drawer>
        <DrawerAppContent className="w-100 flex overflow-auto">
          {content}
        </DrawerAppContent>
      </>
    )
  }

  let wrapper = (
    <>
      <TopAppBar className="absolute left-0 right-0" fixed>
        <TopAppBarRow>
          <TopAppBarSection align="start">
            <TopAppBarIcon navIcon tabIndex={0}>
              <MaterialIcon icon="menu" onClick={handleNavigationIconClick} />
            </TopAppBarIcon>
            <TopAppBarTitle>Cramkle</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust className="w-100 flex relative">
        {content}
      </TopAppBarFixedAdjust>
    </>
  )

  if (isMobile) {
    wrapper = (
      <>
        <Drawer open={drawerOpen} onClose={handleDrawerClose} modal>
          <DrawerContent>{drawerItems}</DrawerContent>
        </Drawer>
        <DrawerAppContent className="w-100">{wrapper}</DrawerAppContent>
      </>
    )
  }

  return <div className="vh-100 flex">{wrapper}</div>
}

export default withRouter(
  graphql<RouteComponentProps, Data>(loadingQuery)(Shell)
)
