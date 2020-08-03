import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabListProps,
  TabPanelProps,
  TabPanels,
  TabProps,
  Tabs,
} from '@reach/tabs'
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@reach/utils'
import classNames from 'classnames'
import React, { HTMLAttributes, forwardRef, useState } from 'react'

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
  const [focused, setFocused] = useState(false)

  const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (evt) => {
    setFocused(false)
    props.onBlur?.(evt)
  }

  const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (evt) => {
    // TODO: remove after fix lands in reach-ui
    if (evt.type === 'blur') {
      handleBlur(evt)
      return
    }
    setFocused(true)
    props.onFocus?.(evt)
  }

  return (
    <ReachTab
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={ref}
      className={classNames(
        className,
        styles.tab,
        'group outline-reset font-medium text-sm relative capitalize px-4 md:px-6 py-2 inline-flex justify-start items-center'
      )}
    >
      {children}
      <div
        className={classNames(
          'absolute top-0 left-0 right-0 bottom-0 bg-primary opacity-0 hover:opacity-08',
          {
            'opacity-08': focused,
          }
        )}
      />
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
