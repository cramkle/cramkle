import React, { createContext, useContext, useMemo } from 'react'

export const HintsContext = createContext({ isMobile: true })

export const HintsProvider: React.FunctionComponent<{ userAgent?: string }> = ({
  children,
  userAgent,
}) => {
  const isMobile = /android|ios|iphone|ipad/i.test(
    !process.browser ? userAgent : navigator.userAgent
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
