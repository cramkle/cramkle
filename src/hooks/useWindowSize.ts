import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [size, setSize] = useState({ height: 0, width: 0 })

  const handleResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(handleResize, [])

  return size
}

export default useWindowSize
