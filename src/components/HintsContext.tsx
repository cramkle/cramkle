'use client'

import { createContext, useContext, useMemo } from 'react'
import * as React from 'react'

export const HintsContext = createContext({ isMobile: true })

export const HintsProvider: React.FC<{ userAgent?: string | null }> = ({
  children,
  userAgent = '',
}) => {
  const isMobile = /android|ios|iphone|ipad/i.test(
    typeof window === 'undefined' ? userAgent ?? '' : navigator.userAgent
  )

  const context = useMemo(
    () => ({
      isMobile,
    }),
    [isMobile]
  )

  return (
    <HintsContext.Provider value={context}>{children}</HintsContext.Provider>
  )
}

export const useHints = () => {
  return useContext(HintsContext)
}
