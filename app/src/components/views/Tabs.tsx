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
        'fw5 f6 relative ttc ph3 pv2 inline-flex justify-start items-center'
      )}
    >
      {children}
    </ReachTab>
  )
}

export { Tabs, TabPanel, TabPanels }
