import * as React from 'react'
import { createPortal } from 'react-dom'

import { useMatchMedia } from '../hooks/useMatchMedia'
import { useHints } from './HintsContext'
import { HeaderContent } from './views/Header'

const HeaderPortal: React.FC = ({ children }) => {
  const headerAnchor = document.getElementById('header-portal-anchor') || null
  const headerMobileAnchor =
    document.getElementById('header-mobile-portal-anchor') || null
  const { isMobile } = useHints()
  const isMediumOrGreaterViewport = useMatchMedia('(min-width: 768px)')

  const shouldRenderMobile = isMobile || !isMediumOrGreaterViewport

  if (!headerAnchor && !headerMobileAnchor) {
    return null
  }

  return createPortal(
    shouldRenderMobile ? <HeaderContent>{children}</HeaderContent> : children,
    isMobile || !isMediumOrGreaterViewport ? headerMobileAnchor : headerAnchor
  )
}

export default HeaderPortal
