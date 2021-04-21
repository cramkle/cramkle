import type { SVGAttributes, VFC } from 'react'

import styles from './LoadingDots.css'

export const LoadingDots: VFC<SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 56 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.circle1}
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
      />
      <circle
        className={styles.circle2}
        cx="28"
        cy="12"
        r="4"
        fill="currentColor"
      />
      <circle
        className={styles.circle3}
        cx="44"
        cy="12"
        r="4"
        fill="currentColor"
      />
    </svg>
  )
}
