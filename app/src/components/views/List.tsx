import classnames from 'classnames'
import React, { ReactNode, useRef } from 'react'
import { TabController, useControlledTabIndex } from 'react-tab-controller'

import useId from '../../hooks/useId'
import styles from './List.css'

export const List: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TabController>
      <ul
        {...props}
        className={classnames(className, 'w-64 flex flex-col px-4 py-2')}
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
        styles.item,
        className,
        'relative z-10 flex items-center px-3 py-2 my-2 rounded overflow-hidden focus:text-action-primary hover:text-action-primary'
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
          styles.backdrop,
          'absolute z-0 top-0 left-0 right-0 bottom-0 bg-primary hidden'
        )}
      />
    </li>
  )
}
