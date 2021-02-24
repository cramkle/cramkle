import { useEffect, useRef, useState } from 'react'

export const useWindowSize = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
