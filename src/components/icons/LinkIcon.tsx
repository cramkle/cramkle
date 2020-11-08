import React from 'react'

export const LinkIcon: React.VFC<React.SVGAttributes<SVGSVGElement>> = (
  props
) => {
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
        d="M7.20712 12.1702L4.70712 14.6702C1.70712 17.6702 3.41043 18.8735 4.20713 19.6702C5.00384 20.4669 6.70712 22.3368 8.70712 20.6702C10.5071 19.1702 12.7071 16.6702 12.7071 16.6702C15.2071 14.1702 15.2071 14.1702 12.7071 11.6702"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.7929 12.1702L19.2929 9.67017C22.2929 6.67017 20.5896 5.46686 19.7929 4.67017C18.9962 3.87347 17.2929 2.0035 15.2929 3.67017C13.4929 5.17017 11.2929 7.67017 11.2929 7.67017C8.79288 10.1702 8.79288 10.1702 11.2929 12.6702"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
