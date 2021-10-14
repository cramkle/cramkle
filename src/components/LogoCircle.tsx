import type { SVGProps, VFC } from 'react'

export const LogoCircle: VFC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="32" fill="white" />
      <path d="M52 22H22V52H52V22Z" fill="#CCDAFF" />
      <path d="M42 12H12V42H42V12Z" fill="#2962FF" />
    </svg>
  )
}
