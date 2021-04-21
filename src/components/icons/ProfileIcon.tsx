import type { SVGAttributes, VFC } from 'react'

export const ProfileIcon: VFC<SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15.957 16.5828C14.674 16.8562 13.343 17 11.9785 17C10.614 17 9.28301 16.8562 8 16.5828C8.20863 14.5697 9.91025 13 11.9785 13C14.0468 13 15.7484 14.5697 15.957 16.5828Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
