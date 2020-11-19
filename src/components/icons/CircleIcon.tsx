import * as React from 'react'

const CircleIcon: React.FC<React.SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2 2"
      width="2"
      height="2"
    >
      <circle cx="1" cy="1" r="1" fill="currentColor" />
    </svg>
  )
}

export default CircleIcon
