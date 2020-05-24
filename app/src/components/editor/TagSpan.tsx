import React from 'react'

const TagSpan: React.FunctionComponent = ({ children }) => {
  return (
    <span className="relative">
      {children}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-yellow opacity-25" />
    </span>
  )
}

export default TagSpan
