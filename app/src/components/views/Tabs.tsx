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
        'font-medium text-sm relative capitalize px-4 md:px-6 py-2 inline-flex justify-start items-center'
      )}
    >
      {children}
      <div
        className={classnames(
          styles.backdrop,
          'hidden absolute top-0 left-0 right-0 bottom-0 bg-primary'
        )}
      />
      <div
        className={classnames(
          styles.border,
          'hidden absolute mx-auto left-0 right-0 bottom-0 rounded-t border-primary border-t-2 border-b w-3/4'
        )}
      />
    </ReachTab>
  )
}

export { Tabs, TabPanel, TabPanels }
