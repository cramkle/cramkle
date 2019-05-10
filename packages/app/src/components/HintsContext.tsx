import React, { useContext, createContext, useMemo } from 'react'

export const HintsContext = createContext({ isMobile: true })

const isMobile = /android|ios|iphone|ipad/i.test(
  window.userAgent || navigator.userAgent
)

export const HintsProvider: React.FunctionComponent = ({ children }) => {
  const context = useMemo(
    () => ({
      isMobile,
    }),
    []
  )

  return (
    <HintsContext.Provider value={context}>{children}</HintsContext.Provider>
  )
}

export const useHints = () => {
  return useContext(HintsContext)
}
