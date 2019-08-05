import { useEffect, useRef, useState } from 'react'

const useWindowSize = () => {
  const timeoutRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { width, height }
}

export default useWindowSize
