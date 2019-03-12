import { useState, useEffect, useContext } from 'react'

import Mobile from '../components/MobileContext'

export const useMobileListener = () => {
  const [mobile, setMobile] = useState(true)

  const handleResize = () => {
    setMobile(window.innerWidth < 1024)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // run for initial mount
  useEffect(handleResize, [])

  return mobile
}

export const useMobile = () => {
  return useContext(Mobile)
}
