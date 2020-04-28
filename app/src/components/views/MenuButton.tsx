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
        'relative bg-surface border-0 border-none rounded py-2 px-1 cursor-pointer overflow-hidden',
        {
          'px-2 br-100': icon,
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
      className={classnames(
        className,
        'mt-1 py-2 border-0 border-none rounded shadow-4 bg-surface'
      )}
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
