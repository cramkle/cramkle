import { MDCTabBarAdapter, MDCTabBarFoundation } from '@material/tab-bar'
import classNames from 'classnames'
import React, { useContext, useEffect, useMemo, useRef } from 'react'

import TabScroller, { TabScrollerRef } from './TabScroller'

const TabBarContext = React.createContext<any>({})

export const useTabBar = () => useContext(TabBarContext)

export interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  indexInView?: number
  activeIndex: number
  onActiveIndexUpdate?: (index: number) => void
  onActivated?: (index: number) => void
  className?: string
  isRtl?: boolean
}

const useLatestRef = <T extends {}>(value: T) => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

const TabBar: React.FC<TabBarProps> = ({
  className,
  indexInView = 0,
  activeIndex = 0,
  onActiveIndexUpdate = () => {},
  onActivated,
  onKeyDown,
  isRtl,
  children,
  ...otherProps
}) => {
  const tabBarRef = useRef<HTMLDivElement>(null)
  const tabScrollerRef = useRef<TabScrollerRef>(null)
  const tabList = useRef<any[]>([])
  const idIndexMap = useRef<{ [id: string]: number }>({})
  const foundationRef = useRef<MDCTabBarFoundation>(null)
  const previousActiveIndex = useRef<number>(-1)

  const isRtlRef = useLatestRef(isRtl)
  const onActiveIndexUpdateRef = useLatestRef(onActiveIndexUpdate)
  const onActivatedRef = useLatestRef(onActivated)

  useEffect(() => {
    const adapter: MDCTabBarAdapter = {
      scrollTo: (scrollX: number) => {
        tabScrollerRef.current && tabScrollerRef.current.scrollTo(scrollX)
      },
      incrementScroll: (scrollXIncrement: number) => {
        tabScrollerRef.current &&
          tabScrollerRef.current.incrementScroll(scrollXIncrement)
      },
      getScrollPosition: () => {
        if (!tabScrollerRef.current) {
          return 0
        }
        return tabScrollerRef.current.getScrollPosition()
      },
      getScrollContentWidth: () => {
        if (!tabScrollerRef.current) {
          return 0
        }
        return tabScrollerRef.current.getScrollContentWidth()
      },
      getOffsetWidth: () => {
        if (!tabBarRef.current) {
          return 0
        }
        return tabBarRef.current.offsetWidth
      },
      isRTL: () => !!isRtlRef.current,
      setActiveTab: (index: number) => {
        if (!onActiveIndexUpdateRef.current) {
          return
        }
        onActiveIndexUpdateRef.current(index)
      },
      activateTabAtIndex: (index: number, clientRect: ClientRect) => {
        tabList.current[index].activate(clientRect)
      },
      deactivateTabAtIndex: (index: number) => {
        tabList.current[index].deactivate()
      },
      focusTabAtIndex: (index: number) => {
        tabList.current[index].focus()
      },
      getTabIndicatorClientRectAtIndex: (index: number) => {
        return tabList.current[index].computeIndicatorClientRect()
      },
      getTabDimensionsAtIndex: (index: number) => {
        return tabList.current[index].computeDimensions()
      },
      getPreviousActiveTabIndex: () => previousActiveIndex.current,
      getFocusedTabIndex: () => {
        const activeElement = document.activeElement
        const currentTabList = tabList.current
        // cannot use findIndex, not supported in IE11
        // cannot use forEach, return statement inside the forEach loop will not return
        for (let i = 0; i < currentTabList.length; i++) {
          if (currentTabList[i].tabRef.current === activeElement) {
            return i
          }
        }
        return -1
      },
      getIndexOfTabById: (id: string) => {
        return tabList.current.map((tab) => tab.props.id).indexOf(id)
      },
      getTabListLength: () => {
        return tabList.current.length
      },
      notifyTabActivated: (index: number) => {
        onActivatedRef.current && onActivatedRef.current(index)
      },
    }

    foundationRef.current = new MDCTabBarFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current.destroy()
    }
  }, [
    isRtlRef,
    onActivatedRef,
    onActiveIndexUpdateRef,
    tabBarRef,
    tabList,
    tabScrollerRef,
  ])

  useEffect(() => {
    foundationRef.current.scrollIntoView(indexInView)
  }, [indexInView])

  useEffect(() => {
    foundationRef.current.activateTab(activeIndex)

    previousActiveIndex.current = activeIndex
  }, [activeIndex])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    previousActiveIndex.current = activeIndex
    foundationRef.current.handleKeyDown(e.nativeEvent)
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  const context = useMemo(
    () => ({
      register: (id: string, tab: any) => {
        if (idIndexMap.current[id]) {
          // bail on registered tabs
          return
        }

        const index = tabList.current.push(tab)
        idIndexMap.current[id] = index - 1

        return () => {
          tabList.current = tabList.current.filter((t) => t !== tab)
          delete idIndexMap.current[id]
        }
      },
      onTabChange: (id: string) => {
        const index = idIndexMap.current[id]
        onActiveIndexUpdate(index)
      },
    }),
    [onActiveIndexUpdate]
  )

  const classes = classNames('mdc-tab-bar', className)

  return (
    <TabBarContext.Provider value={context}>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={classes}
        role="tablist"
        onKeyDown={handleKeyDown}
        ref={tabBarRef}
        {...otherProps}
      >
        <TabScroller ref={tabScrollerRef}>{children}</TabScroller>
      </div>
    </TabBarContext.Provider>
  )
}

export default TabBar
