import React from 'react'

import './ScreenLoader.scss'

const ScreenLoader = ({ children, loading }) => {
  if (!loading) {
    return children
  }

  return <div className="screen-loader">Loading...</div>
}

ScreenLoader.defaultProps = {
  loading: false,
  children: null,
}

export default ScreenLoader
