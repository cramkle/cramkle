import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { graphql, ChildDataProps } from 'react-apollo'
import TopAppBar from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'
import LinearProgress from '@material/react-linear-progress'
import Drawer, { DrawerContent, DrawerAppContent } from '@material/react-drawer'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@material/react-list'

import { useMobile } from '../hooks/useMobile'
import loadingQuery from '../graphql/topBarLoadingQuery.gql'

interface Data {
  topBar: {
    loading: boolean
  }
}

const TopBar: React.FunctionComponent<
  ChildDataProps<RouteComponentProps, Data>
> = ({
  children,
  history,
  data: {
    topBar: { loading },
  },
}) => {
  const isMobile = useMobile()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    fetch('/_c/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => window.location.assign('/login'))
  }

  const handleTopBarIconClick = () => {
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
    <>
      {loading && <LinearProgress indeterminate />}
      <div className="h-100 overflow-auto w-100">{children}</div>
    </>
  )

  if (!isMobile) {
    content = (
      <>
        <Drawer open={drawerOpen} onClose={handleDrawerClose}>
          <DrawerContent>{drawerItems}</DrawerContent>
        </Drawer>
        <DrawerAppContent className="w-100">{content}</DrawerAppContent>
      </>
    )
  }

  let wrapper = (
    <>
      <TopAppBar
        title="Cramkle"
        className="absolute left-0 right-0"
        navigationIcon={
          <MaterialIcon icon="menu" onClick={handleTopBarIconClick} />
        }
      />
      <div className="mdc-top-app-bar--fixed-adjust w-100 h-100 flex">
        {content}
      </div>
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
  graphql<RouteComponentProps, Data>(loadingQuery)(TopBar)
)
