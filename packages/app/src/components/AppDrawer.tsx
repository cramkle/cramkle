import { t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Drawer, {
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent,
  DrawerAppContent,
} from '@material/react-drawer'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@material/react-list'
import MaterialIcon from '@material/react-material-icon'
import React, { ReactNode, useRef, useCallback } from 'react'
import { compose, graphql, ChildDataProps } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'

import NoSSR from './NoSSR'
import { useMobile } from './MobileContext'
import userQuery from '../graphql/userQuery.gql'

interface Data {
  user: {
    email: string
    username: string
  }
}

interface Props extends RouteComponentProps {
  content: ReactNode
  render: (content: ReactNode) => JSX.Element
  open: boolean
  onClose: () => void
}

const AppDrawer: React.FunctionComponent<ChildDataProps<Props, Data>> = ({
  content,
  render,
  open,
  onClose,
  history,
  data: { user },
}) => {
  const isMobile = useMobile()

  const drawerRef = useRef<HTMLElement>(null)

  const handleLogout = useCallback(() => {
    fetch('/_c/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => window.location.assign('/login'))
  }, [])

  const handleHomeClick = useCallback(() => {
    history.push('/home')
  }, [history])

  const handleMarketplaceClick = useCallback(() => {
    history.push('/marketplace')
  }, [history])

  const handleStatisticsClick = useCallback(() => {
    history.push('/statistics')
  }, [history])

  const handleSettingsClick = useCallback(() => {
    history.push('/settings')
  }, [history])

  const drawerItems = (
    <I18n>
      {({ i18n }) => (
        <List dense singleSelection>
          <ListItem onClick={handleHomeClick}>
            <ListItemGraphic graphic={<MaterialIcon icon="home" />} />
            <ListItemText primaryText={i18n._(t`Home`)} />
          </ListItem>
          <ListItem onClick={handleMarketplaceClick}>
            <ListItemGraphic
              graphic={<MaterialIcon icon="store_mall_directory" />}
            />
            <ListItemText primaryText={i18n._(t`Marketplace`)} />
          </ListItem>
          <ListItem onClick={handleStatisticsClick}>
            <ListItemGraphic graphic={<MaterialIcon icon="bar_chart" />} />
            <ListItemText primaryText={i18n._(t`Statistics`)} />
          </ListItem>
          <ListItem onClick={handleSettingsClick}>
            <ListItemGraphic graphic={<MaterialIcon icon="settings" />} />
            <ListItemText primaryText={i18n._(t`Settings`)} />
          </ListItem>
          <ListItem onClick={handleLogout}>
            <ListItemGraphic graphic={<MaterialIcon icon="exit_to_app" />} />
            <ListItemText primaryText={i18n._(t`Logout`)} />
          </ListItem>
        </List>
      )}
    </I18n>
  )

  const header = (
    <DrawerHeader>
      <DrawerTitle>{user.username}</DrawerTitle>
      <DrawerSubtitle>{user.email}</DrawerSubtitle>
    </DrawerHeader>
  )

  if (isMobile) {
    return (
      <>
        <NoSSR fallback={<aside className="mdc-drawer mdc-drawer--modal" />}>
          <Drawer open={open} onClose={onClose} modal>
            {header}
            <DrawerContent>{drawerItems}</DrawerContent>
          </Drawer>
        </NoSSR>
        <DrawerAppContent className="w-100">{render(content)}</DrawerAppContent>
      </>
    )
  }

  return render(
    <>
      <NoSSR
        fallback={<aside className="mdc-drawer mdc-drawer--dismissible" />}
      >
        <Drawer
          className="br-0 bottom-0"
          open={open}
          dismissible
          innerRef={drawerRef}
          style={{ height: 'calc(100vh - 65px)' }}
        >
          {header}
          <DrawerContent>{drawerItems}</DrawerContent>
        </Drawer>
      </NoSSR>
      <DrawerAppContent className="w-100 flex overflow-auto">
        {content}
      </DrawerAppContent>
    </>
  )
}

export default compose(
  graphql(userQuery),
  withRouter
)(AppDrawer)
