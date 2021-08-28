import type { ReactNode, VFC } from 'react'
import ReactDOM from 'react-dom'

interface PortalProps {
  children: ReactNode
  target?: HTMLElement | undefined
}

const Portal: VFC<PortalProps> = ({
  children,
  target = document.getElementById('portal-anchor') ?? document.body,
}) => {
  return ReactDOM.createPortal(children, target)
}

export default Portal
