import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabListProps,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
} from '@reach/tabs'
import classnames from 'classnames'
import React, { HTMLAttributes } from 'react'

import styles from './Tabs.css'

export const TabList: React.FC<
  TabListProps & HTMLAttributes<HTMLDivElement>
> = ({ children, className = '', ...props }) => {
  return (
    <ReachTabList {...props} className={classnames(className, 'bg-surface')}>
      {children}
    </ReachTabList>
  )
}

export const Tab: React.FC<TabProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <ReachTab
      {...props}
      className={classnames(
        className,
        styles.tab,
        'font-medium text-sm relative capitalize px-4 py-2 inline-flex justify-start items-center'
      )}
    >
      {children}
    </ReachTab>
  )
}

export { Tabs, TabPanel, TabPanels }
