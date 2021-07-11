import { useEffect, useState } from 'react'
import type * as React from 'react'

interface Props {
  fallback?: JSX.Element
  children?: JSX.Element
}

export const useSsr = () => {
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])

  return isServer
}

export const NoSSR: React.FunctionComponent<Props> = ({
  fallback = null,
  children,
}) => {
  const isServer = useSsr()

  return isServer ? fallback : (children as JSX.Element)
}
