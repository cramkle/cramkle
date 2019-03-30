import React, { useState, useEffect, ReactNode } from 'react'

interface Props {
  fallback?: ReactNode
}

const NoSSR: React.FunctionComponent<Props> = ({
  fallback = null,
  children,
}) => {
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])

  return <>{isServer ? fallback : children}</>
}

export default NoSSR
