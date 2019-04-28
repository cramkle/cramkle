import React, { useContext, createContext } from 'react'

const Mobile = createContext(true)

const isMobile = /android|ios|iphone|ipad/i.test(
  window.userAgent || navigator.userAgent
)

export const MobileProvider: React.FunctionComponent = ({ children }) => {
  return <Mobile.Provider value={isMobile}>{children}</Mobile.Provider>
}

export const useMobile = () => {
  return useContext(Mobile)
}
