import React, { useState } from 'react'
import { useWindowSize } from 'the-platform'
import { withRouter } from 'react-router'
import { canUseDOM } from 'exenv'

import TopAppBar from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'
import Drawer, { DrawerContent, DrawerAppContent } from '@material/react-drawer'
import List, { ListItem, ListItemText, ListItemGraphic } from '@material/react-list'

const TopBar = ({ children, history }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  let windowWidth

  if (canUseDOM) {
    windowWidth = useWindowSize().width
  } else {
    windowWidth = 800
  }

  if (React.Children.count(children) === 0) {
    return null
  }

  const showDrawerAsModal = windowWidth <= 900

  return (
    <div className="vh-100 flex">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        modal={showDrawerAsModal}
      >
        <DrawerContent>
          <List>
            <ListItem
              tabIndex={1}
              onClick={() => history.push('/dashboard')}
            >
              <ListItemGraphic graphic={<MaterialIcon icon="home" />} />
              <ListItemText primaryText="Dashboard" />
            </ListItem>
            <ListItem>
              <ListItemGraphic graphic={<MaterialIcon icon="store_mall_directory" />} />
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
            <ListItem>
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
          navigationIcon={showDrawerAsModal ? (
            <MaterialIcon
              icon="menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
          ) : null}
        />
        <div className="mdc-top-app-bar--fixed-adjust w-100">
          {children}
        </div>
      </DrawerAppContent>
    </div>
  )
}

TopBar.defaultProps = {
  children: null,
}

export default withRouter(TopBar)
