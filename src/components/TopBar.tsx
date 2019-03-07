import React, { useState, useCallback } from 'react'
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = useCallback(() => {
    fetch('/_c/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => window.location.assign('/login'))
  }, [])

  const handleTopBarIconClick = useCallback(() => {
    setDrawerOpen(!drawerOpen)
  }, [drawerOpen])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  if (React.Children.count(children) === 0) {
    return null
  }

  return (
    <div className="vh-100 flex">
      <Drawer open={drawerOpen} onClose={handleDrawerClose} modal>
        <DrawerContent>
          <List>
            <ListItem tabIndex={1} onClick={() => history.push('/dashboard')}>
              <ListItemGraphic graphic={<MaterialIcon icon="home" />} />
              <ListItemText primaryText="Dashboard" />
            </ListItem>
            <ListItem>
              <ListItemGraphic
                graphic={<MaterialIcon icon="store_mall_directory" />}
              />
              <ListItemText primaryText="Marketplace" />
            </ListItem>
            <ListItem>
              <ListItemGraphic graphic={<MaterialIcon icon="bar_chart" />} />
              <ListItemText primaryText="Statistics" />
            </ListItem>
            <ListItem>
              <ListItemGraphic graphic={<MaterialIcon icon="settings" />} />
              <ListItemText primaryText="Settings" />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemGraphic graphic={<MaterialIcon icon="exit_to_app" />} />
              <ListItemText primaryText="Logout" />
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>
      <DrawerAppContent className="w-100">
        <TopAppBar
          title="Cramkle"
          className="absolute left-0 right-0"
          navigationIcon={
            <MaterialIcon icon="menu" onClick={handleTopBarIconClick} />
          }
        />
        <div className="mdc-top-app-bar--fixed-adjust w-100 h-100">
          {loading && <LinearProgress indeterminate />}
          <div className="h-100 overflow-auto">{children}</div>
        </div>
      </DrawerAppContent>
    </div>
  )
}

export default withRouter(
  graphql<RouteComponentProps, Data>(loadingQuery)(TopBar)
)
