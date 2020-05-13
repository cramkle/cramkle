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
import React, { ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

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
          'px-2 rounded-full': icon,
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
        'mt-1 py-0 border-0 border-none rounded shadow-lg bg-surface'
      )}
    >
      <div className="py-2 h-full shadow-xs">{children}</div>
    </ReachMenuList>
  )
}

export const MenuItem: React.FC<MenuItemProps & { icon?: ReactNode }> = ({
  children,
  icon,
  ...props
}) => {
  return (
    <ReachMenuItem
      {...props}
      className={classnames(styles.menuItem, 'flex items-center')}
    >
      {icon}
      <div className={classnames({ 'ml-3': icon })}>{children}</div>
    </ReachMenuItem>
  )
}

export const MenuLink: React.FC<MenuLinkProps & LinkProps> = ({
  children,
  ...props
}) => {
  return (
    <ReachMenuLink {...props} className={classnames(styles.menuItem)} as={Link}>
      {children}
    </ReachMenuLink>
  )
}

export { Menu }
