import type { SVGProps, VFC } from 'react'

export const Logo: VFC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 128 128"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#CCDAFF" x="32" y="32" width="96" height="96"></rect>
      <rect fill="#2962FF" x="0" y="0" width="96" height="96"></rect>
    </svg>
  )
}
