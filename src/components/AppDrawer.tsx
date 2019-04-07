import Drawer, { DrawerContent, DrawerAppContent } from '@material/react-drawer'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@material/react-list'
import MaterialIcon from '@material/react-material-icon'
import React, { ReactNode, useRef, useLayoutEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { useMobile } from './MobileContext'
import useWindowSize from '../hooks/useWindowSize'

interface Props extends RouteComponentProps {
  content: ReactNode
  render: (content: ReactNode) => JSX.Element
  open: boolean
  onClose: () => void
}

const AppDrawer: React.FunctionComponent<Props> = ({
  content,
  render,
  open,
  onClose,
  history,
}) => {
  const isMobile = useMobile()
  const { height: windowHeight } = useWindowSize()

  const drawerRef = useRef<HTMLElement>(null)

  const handleLogout = () => {
    fetch('/_c/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => window.location.assign('/login'))
  }

  useLayoutEffect(() => {
    if (isMobile || drawerRef.current === null) {
      return
    }

    drawerRef.current.style.height = `${windowHeight - 48}px`
  }, [isMobile, windowHeight])

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

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onClose={onClose} modal>
          <DrawerContent>{drawerItems}</DrawerContent>
        </Drawer>
        <DrawerAppContent className="w-100">{render(content)}</DrawerAppContent>
      </>
    )
  }

  return render(
    <>
      <Drawer open={open} dismissible innerRef={drawerRef}>
        <DrawerContent>{drawerItems}</DrawerContent>
      </Drawer>
      <DrawerAppContent className="w-100 flex overflow-auto">
        {content}
      </DrawerAppContent>
    </>
  )
}

export default withRouter(AppDrawer)
