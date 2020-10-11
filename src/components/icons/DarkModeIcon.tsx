import React from 'react'

const DarkModeIcon: React.FC<React.SVGAttributes<SVGSVGElement>> = (props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5229 22 22 17.5228 22 12C22 6.47715 17.5229 2 12 2C9.5203 2 7.25138 2.90257 5.50388 4.39711C6.28931 4.1394 7.12839 4 8.00001 4C12.4183 4 16 7.58172 16 12C16 16.4183 12.4183 20 8.00001 20C7.12839 20 6.28931 19.8606 5.50388 19.6029C7.25138 21.0974 9.5203 22 12 22Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default DarkModeIcon
