import React, { useState } from 'react'
import { useWindowSize } from 'the-platform'

import TopAppBar from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'
import Drawer, { DrawerContent, DrawerAppContent } from '@material/react-drawer'
import List, { ListItem, ListItemText, ListItemGraphic } from '@material/react-list'

const TopBar = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { width: windowWidth } = useWindowSize()

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
            <ListItem tabIndex={0}>
              <ListItemGraphic graphic={<MaterialIcon icon="store_mall_directory" />} />
              <ListItemText primaryText="Marketplace" />
            </ListItem>
            <ListItem tabIndex={1}>
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

export default TopBar
