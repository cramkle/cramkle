import type { TabListProps, TabPanelProps, TabProps } from '@reach/tabs'
import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabPanels,
  Tabs,
} from '@reach/tabs'
import type { ForwardRefExoticComponentWithAs } from '@reach/utils'
import { forwardRefWithAs } from '@reach/utils'
import classNames from 'classnames'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import * as React from 'react'

import styles from './Tabs.css'

export const TabList: React.FC<
  TabListProps & HTMLAttributes<HTMLDivElement>
> = ({ children, className = '', ...props }) => {
  return (
    <ReachTabList {...props} className={classNames(className, 'bg-surface')}>
      {children}
    </ReachTabList>
  )
}

export const Tab = forwardRefWithAs<TabProps, 'button'>(function Tab(
  { children, className = '', ...props },
  ref
) {
  return (
    <ReachTab
      {...props}
      ref={ref}
      className={classNames(
        className,
        styles.tab,
        'group outline-reset font-medium text-sm relative capitalize px-4 md:px-6 py-2 inline-flex justify-start items-center border-0'
      )}
    >
      {children}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary opacity-0 hover:opacity-08 group-focus:opacity-08" />
      <div
        className={classNames(
          styles.border,
          'hidden absolute left-0 right-0 bottom-0 rounded-t border-primary border-t-2 border-b mx-2 md:mx-6'
        )}
      />
    </ReachTab>
  )
})

export const TabPanel: ForwardRefExoticComponentWithAs<
  'div',
  TabPanelProps
> = forwardRef(function TabPanel({ className, ...props }, ref) {
  return (
    <ReachTabPanel
      ref={ref}
      className={classNames(className, 'outline-reset')}
      {...props}
    />
  )
})

export { Tabs, TabPanels }
