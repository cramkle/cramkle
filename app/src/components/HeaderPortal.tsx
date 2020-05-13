import React from 'react'
import { createPortal } from 'react-dom'

const HeaderPortal: React.FC = ({ children }) => {
  const headerAnchor = document.getElementById('header-portal-anchor') || null

  if (!headerAnchor) {
    return null
  }

  return createPortal(children, headerAnchor)
}

export default HeaderPortal
