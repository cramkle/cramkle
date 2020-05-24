import classnames from 'classnames'
import React, { ReactNode, useRef } from 'react'
import { TabController, useControlledTabIndex } from 'react-tab-controller'

import useId from '../../hooks/useId'

export const List: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TabController>
      <ul
        {...props}
        className={classnames(className, 'flex flex-col px-4 py-2')}
      >
        {children}
      </ul>
    </TabController>
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: ReactNode
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  children,
  className,
  ...props
}) => {
  const id = useId()
  const ref = useRef<HTMLLIElement>(null)

  const { tabIndex, onKeyDown } = useControlledTabIndex(ref, id)

  return (
    <li
      {...props}
      ref={ref}
      className={classnames(
        className,
        'relative group z-10 flex items-center px-3 py-2 my-2 rounded overflow-hidden focus:text-action-primary hover:text-action-primary transition-colors ease-in-out duration-200'
      )}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {icon}
      <span
        className={classnames('inline-block select-none', {
          'ml-6': icon,
        })}
      >
        {children}
      </span>
      <div
        className={classnames(
          'absolute -z-1 top-0 left-0 right-0 bottom-0 bg-primary opacity-0 group-hover:opacity-12 group-focus:opacity-12 transition-opacity ease-in-out duration-200'
        )}
      />
    </li>
  )
}
