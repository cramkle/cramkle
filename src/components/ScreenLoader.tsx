import * as React from 'react'

import './ScreenLoader.scss'

interface ScreenLoaderProps {
  loading: boolean
  children?: React.ReactNode
}

const ScreenLoader: React.StatelessComponent<ScreenLoaderProps> = ({ children, loading }) => {
  if (!loading) {
    return children as JSX.Element
  }

  return <div className="screen-loader">Loading...</div>
}

ScreenLoader.defaultProps = {
  loading: false,
  children: null,
}

export default ScreenLoader
