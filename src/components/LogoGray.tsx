import type { SVGProps, VFC } from 'react'

export const LogoGray: VFC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 128 128"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#dadada" x="32" y="32" width="96" height="96"></rect>
      <rect fill="#646464" x="0" y="0" width="96" height="96"></rect>
    </svg>
  )
}
