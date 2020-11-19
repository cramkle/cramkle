import { useEffect, useState } from 'react'
import * as React from 'react'

interface Props {
  fallback?: JSX.Element
  children?: JSX.Element
}

const NoSSR: React.FunctionComponent<Props> = ({
  fallback = null,
  children,
}) => {
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])

  return isServer ? fallback : (children as JSX.Element)
}

export default NoSSR
