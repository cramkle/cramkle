import React from 'react'

export const CodeIcon: React.VFC<React.SVGAttributes<SVGSVGElement>> = (
  props
) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 18L0 12L6 6L7.5 7.5L3 12L7.5 16.5L6 18Z"
        fill="currentColor"
      />
      <path
        d="M18 18L24 12L18 6L16.5 7.5L21 12L16.5 16.5L18 18Z"
        fill="currentColor"
      />
      <path
        d="M15.5 5.5L13.5 4.75L8.5 18.75L10.5 19.5L15.5 5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
