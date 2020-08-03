import { useEffect, useMemo, useState } from 'react'

export const useMatchMedia = (mediaQuery: string) => {
  const mql = useMemo(
    () =>
      typeof window !== 'undefined' ? window.matchMedia(mediaQuery) : undefined,
    [mediaQuery]
  )

  const [mediaMatches, setMediaMatches] = useState(mql?.matches)

  useEffect(() => {
    const handler = (evt: MediaQueryListEvent) => {
      setMediaMatches(evt.matches)
    }

    mql?.addListener(handler)

    return () => mql?.removeListener(handler)
  }, [mql])

  return mediaMatches
}
