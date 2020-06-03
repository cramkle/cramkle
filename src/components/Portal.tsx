import React from 'react'
import ReactDOM from 'react-dom'

const Portal: React.FunctionComponent = ({ children }) => {
  const anchor = document.getElementById('portal-anchor') || document.body
  return ReactDOM.createPortal(children, anchor)
}

export default Portal
