import React, { useState, useEffect } from 'react'

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

export default React.memo(NoSSR)
