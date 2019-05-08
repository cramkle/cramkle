import React, { useContext, createContext } from 'react'

export const MobileContext = createContext(true)

const isMobile = /android|ios|iphone|ipad/i.test(
  window.userAgent || navigator.userAgent
)

export const MobileProvider: React.FunctionComponent = ({ children }) => {
  return (
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  )
}

export const useMobile = () => {
  return useContext(MobileContext)
}
