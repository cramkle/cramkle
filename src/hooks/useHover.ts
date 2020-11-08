import { useEffect, useState } from 'react'

const useHover = (ref: React.RefObject<HTMLElement>) => {
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const node = ref.current

    const handleMouseEnter = () => {
      setHovering(true)
    }

    const handleMouseLeave = () => {
      setHovering(false)
    }

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return hovering
}

export default useHover
