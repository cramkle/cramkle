import classnames from 'classnames'
import React, { CSSProperties } from 'react'

import styles from './CircularProgress.scss'

interface Props extends React.HTMLProps<HTMLDivElement> {
  size?: number
}

const CircularProgress: React.FC<Props> = ({
  size = 28,
  style = {},
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={classnames(className, styles.spinner, 'border-primary')}
      style={{ '--size': `${size}px`, ...style } as CSSProperties}
    >
      <div className={styles.spinnerContainer}>
        <div className={styles.spinnerLayer}>
          <div
            className={`${styles.spinnerCircleClipper} ${styles.spinnerLeft}`}
          >
            <div className={styles.spinnerCircle}></div>
          </div>
          <div className={styles.spinnerGapPatch}>
            <div className={styles.spinnerCircle}></div>
          </div>
          <div
            className={`${styles.spinnerCircleClipper} ${styles.spinnerRight}`}
          >
            <div className={styles.spinnerCircle}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularProgress
