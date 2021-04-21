import type { SVGAttributes, VFC } from 'react'

export const CaretDownIcon: VFC<SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.12 9.29L12 13.17L15.88 9.29C16.27 8.9 16.9 8.9 17.29 9.29C17.68 9.68 17.68 10.31 17.29 10.7L12.7 15.29C12.31 15.68 11.68 15.68 11.29 15.29L6.7 10.7C6.31 10.31 6.31 9.68 6.7 9.29C7.09 8.91 7.73 8.9 8.12 9.29Z"
        fill="currentColor"
      />
    </svg>
  )
}
