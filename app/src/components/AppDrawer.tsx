import { useQuery } from '@apollo/react-hooks'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Drawer, {
  DrawerAppContent,
  DrawerContent,
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
} from '@material/react-drawer'
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
} from '@material/react-list'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useHistory, useLocation } from 'react-router'

import { useHints } from './HintsContext'
import NoSSR from './NoSSR'
import { UserQuery } from './__generated__/UserQuery'
import USER_QUERY from './userQuery.gql'
import Icon from './views/Icon'

interface Props {
  content: ReactNode
  render: (content: ReactNode) => JSX.Element
  open: boolean
  onClose: () => void
}

const getListIndexFromPathname = (pathname: string) => {
  switch (pathname) {
    case '/home':
    case '/decks':
    case '/models':
      return 0
    case '/marketplace':
      return 1
    case '/statistics':
      return 2
    case '/settings':
      return 3
    default:
      return -1
  }
}

const AppDrawer: React.FunctionComponent<Props> = ({
  content,
  render,
  open,
  onClose,
}) => {
  const history = useHistory()
  const location = useLocation()
  const { data } = useQuery<UserQuery>(USER_QUERY)

  const me = data?.me

  const { i18n } = useLingui()

  const [index, setIndex] = useState(() =>
    getListIndexFromPathname(location.pathname)
  )

  useEffect(() => {
    setIndex(getListIndexFromPathname(location.pathname))
  }, [location.pathname])

  const { isMobile } = useHints()

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
    <List dense singleSelection selectedIndex={index}>
      <ListItem onClick={handleHomeClick}>
        <ListItemGraphic graphic={<Icon icon="home" aria-hidden="true" />} />
        <ListItemText primaryText={i18n._(t`Home`)} />
      </ListItem>
      <ListItem onClick={handleMarketplaceClick}>
        <ListItemGraphic
          graphic={<Icon icon="store_mall_directory" aria-hidden="true" />}
        />
        <ListItemText primaryText={i18n._(t`Marketplace`)} />
      </ListItem>
      <ListItem onClick={handleStatisticsClick}>
        <ListItemGraphic
          graphic={<Icon icon="bar_chart" aria-hidden="true" />}
        />
        <ListItemText primaryText={i18n._(t`Statistics`)} />
      </ListItem>
      <ListItem onClick={handleSettingsClick}>
        <ListItemGraphic
          graphic={<Icon icon="settings" aria-hidden="true" />}
        />
        <ListItemText primaryText={i18n._(t`Settings`)} />
      </ListItem>
      <ListItem onClick={handleLogout}>
        <ListItemGraphic
          graphic={<Icon icon="exit_to_app" aria-hidden="true" />}
        />
        <ListItemText primaryText={i18n._(t`Logout`)} />
      </ListItem>
    </List>
  )

  const header = (
    <DrawerHeader>
      {me && (
        <>
          <DrawerTitle>{me.username}</DrawerTitle>
          <DrawerSubtitle>{me.email}</DrawerSubtitle>
        </>
      )}
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

export default AppDrawer
