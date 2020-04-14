import {
  Menu,
  MenuButtonProps,
  MenuItemProps,
  MenuLinkProps,
  MenuListProps,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuLink as ReachMenuLink,
  MenuList as ReachMenuList,
} from '@reach/menu-button'
import classnames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import styles from './MenuButton.css'

export const MenuButton: React.FC<MenuButtonProps & { icon?: boolean }> = ({
  children,
  icon = false,
  className = '',
  ...props
}) => {
  return (
    <ReachMenuButton
      {...props}
      className={classnames(
        className,
        styles.menuButton,
        'relative bg-surface bn br2 pv2 ph1 pointer overflow-hidden',
        {
          'ph2 br-100': icon,
        }
      )}
    >
      {children}
    </ReachMenuButton>
  )
}

export const MenuList: React.FC<MenuListProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <ReachMenuList
      {...props}
      className={classnames(className, 'mt1 pv2 bn br2 shadow-4 bg-surface')}
    >
      {children}
    </ReachMenuList>
  )
}

export const MenuItem: React.FC<MenuItemProps> = ({ children, ...props }) => {
  return (
    <ReachMenuItem {...props} className={classnames(styles.menuItem)}>
      {children}
    </ReachMenuItem>
  )
}

export const MenuLink: React.FC<MenuLinkProps> = ({ children, ...props }) => {
  return (
    <ReachMenuLink {...props} className={classnames(styles.menuItem)} as={Link}>
      {children}
    </ReachMenuLink>
  )
}

export { Menu }
